import fs from "fs";
import matter from "gray-matter";
import path from "path";

const ROOT = process.cwd();

export interface Term {
  slug: string;
  title: string;
  description?: string;
  category: string;
  content: string;
}

export function getAllTerms(): Term[] {
  const termsDir = path.join(ROOT, "terminologies");
  if (!fs.existsSync(termsDir)) return [];

  const terms: Term[] = [];
  const files = fs.readdirSync(termsDir).filter((f) => /\.mdx?$/.test(f));

  for (const file of files) {
    const category = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(termsDir, file), "utf-8");

    const sections = raw.split(/^---$/m).filter((s) => s.trim());

    for (let i = 0; i < sections.length; i += 2) {
      const frontmatterStr = sections[i];
      const contentStr = sections[i + 1] || "";

      try {
        const parsed = matter(`---\n${frontmatterStr}\n---\n${contentStr}`);
        if (parsed.data.slug) {
          terms.push({
            slug: parsed.data.slug,
            title: parsed.data.title || parsed.data.slug,
            description: parsed.data.description,
            category,
            content: parsed.content
          });
        }
      } catch {
        continue;
      }
    }
  }

  return terms;
}

export function getTermCategories(): string[] {
  const termsDir = path.join(ROOT, "terminologies");
  if (!fs.existsSync(termsDir)) return [];
  return fs
    .readdirSync(termsDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
