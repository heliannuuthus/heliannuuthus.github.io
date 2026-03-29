import dayjs from "dayjs";
import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";
import { stripMarkdown } from "./strip-markdown.mjs";

const ROOT = path.join(/* turbopackIgnore: true */ process.cwd());

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  authors: string[];
  tags: string[];
  description?: string;
  unlisted?: boolean;
  draft?: boolean;
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

  const plain = stripMarkdown(raw) as string;

  if (!plain) return undefined;
  return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
}

function resolvePartialImports(content: string, filePath: string): string {
  const fileDir = path.dirname(filePath);
  const importRe = /^\s*import\s+(\w+)\s+from\s+["']([^"']+\.mdx?)["'];?\s*$/gm;

  const imports = new Map<string, string>();
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(content)) !== null) {
    const [, name, relPath] = match;
    const absPath = path.resolve(fileDir, relPath);
    if (fs.existsSync(absPath)) {
      const { content: partial } = matter(fs.readFileSync(absPath, "utf-8"));
      imports.set(name, resolvePartialImports(partial, absPath));
    }
  }

  let resolved = content.replace(importRe, "");
  for (const [name, body] of imports) {
    resolved = resolved.replace(new RegExp(`<${name}\\s*/>`, "g"), body);
  }
  return resolved;
}

function cleanMdxContent(content: string, filePath: string): string {
  let cleaned = resolvePartialImports(content, filePath);

  const truncateIdx = cleaned.search(/<!--\s*truncate\s*-->/);
  if (truncateIdx !== -1) {
    cleaned = cleaned.replace(/^[\s\S]*?<!--\s*truncate\s*-->/, "");
  }

  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  const lines = cleaned.split("\n");
  let inCodeBlock = false;
  const filteredLines: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && /^\s*import\s+/.test(line)) {
      if (/from\s+["']/.test(line)) {
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

        const slug = data.slug || entry.name.replace(/\.mdx?$/, "");
        const dateStr = data.date
          ? dayjs(data.date as string | Date).format("YYYY-MM-DD")
          : extractDate(path.relative(ROOT, fullPath));

        posts.push({
          slug,
          title: data.title || slug,
          date: dateStr,
          authors: Array.isArray(data.authors)
            ? data.authors
            : [data.authors || "heliannuuthus"],
          tags: Array.isArray(data.tags) ? data.tags : [],
          description: data.description || extractExcerpt(content),
          unlisted: !!data.unlisted,
          draft: !!data.draft
        });
      }
    }
  }

  walk(contentDir);
  return posts.sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );
}

export function getBlogPosts(): PostMeta[] {
  return getPostsFromDir("blog");
}

export function getEssayPosts(): PostMeta[] {
  return getPostsFromDir("essay");
}

export interface EssayEntry {
  slug: string;
  date: string;
  content: string;
  draft?: boolean;
}

function extractEssayDate(filePath: string, data: Record<string, unknown>): string {
  if (data.date) return dayjs(data.date as string | Date).format("YYYY-MM-DD");

  const rel = path.relative(ROOT, filePath);
  const dirMatch = rel.match(/(\d{4}-\d{2})/);
  const basename = path.basename(filePath, path.extname(filePath));
  const dayMatch = basename.match(/^(\d{1,2})$/);

  if (dirMatch && dayMatch) {
    return `${dirMatch[1]}-${dayMatch[1].padStart(2, "0")}`;
  }

  return extractDate(rel);
}

export function getEssayEntries(): EssayEntry[] {
  const contentDir = path.join(ROOT, "essay");
  if (!fs.existsSync(contentDir)) return [];

  const entries: EssayEntry[] = [];

  function walk(currentDir: string) {
    const dirEntries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of dirEntries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_")) continue;
        walk(fullPath);
      } else if (/\.(mdx?|MDX?)$/.test(entry.name)) {
        if (entry.name.startsWith("_")) continue;
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(raw);

        if (data.unlisted) continue;

        const dateStr = extractEssayDate(fullPath, data);
        const slug = data.slug || dateStr;
        const cleaned = cleanMdxContent(content, fullPath);

        entries.push({
          slug,
          date: dateStr,
          content: cleaned,
          draft: !!data.draft
        });
      }
    }
  }

  walk(contentDir);
  return entries.sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );
}

export function getEssayBySlug(slug: string): { date: string; content: string; draft?: boolean } | null {
  const entry = getEssayEntries().find((e) => e.slug === slug);
  return entry ? { date: entry.date, content: entry.content, draft: entry.draft } : null;
}

export function getAllEssaySlugs(): string[] {
  return getEssayEntries().map((e) => e.slug);
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

  const dateStr = data.date
    ? dayjs(data.date as string | Date).format("YYYY-MM-DD")
    : extractDate(path.relative(ROOT, filePath));

  const cleanContent = cleanMdxContent(content, filePath);

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
      description: data.description || extractExcerpt(content, 2000),
      unlisted: !!data.unlisted,
      draft: !!data.draft
    },
    content: cleanContent
  };
}

export function getAllSlugs(dir: string): string[] {
  return getPostsFromDir(dir)
    .filter((p) => !p.draft)
    .map((p) => p.slug);
}
