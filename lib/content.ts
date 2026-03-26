import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";

const ROOT = process.cwd();

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  authors: string[];
  tags: string[];
  description?: string;
  unlisted?: boolean;
}

export interface Author {
  name: string;
  title: string;
  url: string;
  image_url: string;
  page: boolean;
  socials?: Record<string, string>;
}

export interface TagInfo {
  label: string;
  permalink: string;
  description: string;
}

function extractDate(filePath: string): string {
  const dirMatch = filePath.match(/(\d{4}-\d{2})/);
  if (dirMatch) return `${dirMatch[1]}-01`;

  const fileMatch = filePath.match(/(\d{4}-\d{2}-\d{2})/);
  if (fileMatch) return fileMatch[1];

  return "1970-01-01";
}

function extractExcerpt(content: string, maxLen = 160): string | undefined {
  const truncateMatch = content.match(/<!--\s*truncate\s*-->/);
  let raw = truncateMatch
    ? content.slice(0, truncateMatch.index)
    : content.split(/\n\n/)[0] ?? "";

  if (!raw.trim()) return undefined;

  const plain = raw
    .replace(/^\s*import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*?)]\([^)]*\)/g, "$1")
    .replace(/:(?:term|ctip)\[([^\]]*?)]\{[^}]*\}/g, "$1")
    .replace(/[*_~`#>|]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (!plain) return undefined;
  return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
}

function cleanMdxContent(content: string): string {
  let cleaned = content;

  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  const lines = cleaned.split("\n");
  let inCodeBlock = false;
  const filteredLines: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && /^\s*import\s+/.test(line)) {
      if (/from\s+["']/.test(line) || /from\s+["']/.test(line)) {
        continue;
      }
    }

    filteredLines.push(line);
  }

  return filteredLines.join("\n");
}

function getPostsFromDir(dir: string): PostMeta[] {
  const contentDir = path.join(ROOT, dir);
  if (!fs.existsSync(contentDir)) return [];

  const posts: PostMeta[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_")) continue;
        walk(fullPath);
      } else if (/\.(mdx?|MDX?)$/.test(entry.name)) {
        if (entry.name.startsWith("_")) continue;
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);

        if (data.unlisted || data.draft) continue;

        const slug = data.slug || entry.name.replace(/\.mdx?$/, "");
        const dateStr =
          data.date?.toString() || extractDate(path.relative(ROOT, fullPath));

        posts.push({
          slug,
          title: data.title || slug,
          date: dateStr,
          authors: Array.isArray(data.authors)
            ? data.authors
            : [data.authors || "heliannuuthus"],
          tags: Array.isArray(data.tags) ? data.tags : [],
          description: data.description || extractExcerpt(content)
        });
      }
    }
  }

  walk(contentDir);
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPosts(): PostMeta[] {
  return getPostsFromDir("blog");
}

export function getEssayPosts(): PostMeta[] {
  return getPostsFromDir("essay");
}

export function getAuthors(): Record<string, Author> {
  const filePath = path.join(ROOT, "content/authors.yml");
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf-8");
  return (yaml.load(raw) as Record<string, Author>) || {};
}

export function getTags(): Record<string, TagInfo> {
  const filePath = path.join(ROOT, "content/tags.yml");
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf-8");
  return (yaml.load(raw) as Record<string, TagInfo>) || {};
}

export function getPostBySlug(
  dir: string,
  slug: string
): { meta: PostMeta; content: string } | null {
  const contentDir = path.join(ROOT, dir);
  if (!fs.existsSync(contentDir)) return null;

  function findFile(currentDir: string): string | null {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_")) continue;
        const found = findFile(fullPath);
        if (found) return found;
      } else if (/\.(mdx?|MDX?)$/.test(entry.name)) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(raw);
        const fileSlug = data.slug || entry.name.replace(/\.mdx?$/, "");
        if (fileSlug === slug) return fullPath;
      }
    }
    return null;
  }

  const filePath = findFile(contentDir);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (data.draft) return null;

  const dateStr =
    data.date?.toString() || extractDate(path.relative(ROOT, filePath));

  const cleanContent = cleanMdxContent(content);

  const postSlug =
    data.slug || path.basename(filePath).replace(/\.mdx?$/, "");

  return {
    meta: {
      slug: postSlug,
      title: data.title || postSlug,
      date: dateStr,
      authors: Array.isArray(data.authors)
        ? data.authors
        : [data.authors || "heliannuuthus"],
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description
    },
    content: cleanContent
  };
}

export function getAllSlugs(dir: string): string[] {
  return getPostsFromDir(dir).map((p) => p.slug);
}
