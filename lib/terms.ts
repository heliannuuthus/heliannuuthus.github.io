import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const ROOT = path.join(/* turbopackIgnore: true */ process.cwd());

export interface Term {
  slug: string;
  title: string;
  definition: string;
  category: string;
  aliases?: string[];
  content?: string;
  contentHtml?: string;
}

let cached: Term[] | null = null;

function parseYmlTerms(file: string, category: string): Term[] {
  const raw = fs.readFileSync(file, "utf-8");
  const entries = yaml.load(raw) as Array<Omit<Term, "category">> | null;
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((e) => e.slug && e.title)
    .map((e) => ({
      slug: e.slug,
      title: e.title,
      definition: e.definition || "",
      category,
      aliases: e.aliases
    }));
}

function parseMdxTerms(file: string, category: string): Term[] {
  const raw = fs.readFileSync(file, "utf-8");
  const lines = raw.split("\n");
  const terms: Term[] = [];

  const dashLines: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") dashLines.push(i);
  }

  for (let d = 0; d + 1 < dashLines.length; d++) {
    const openLine = dashLines[d];
    const closeLine = dashLines[d + 1];
    const yamlBlock = lines.slice(openLine + 1, closeLine).join("\n").trim();
    if (!yamlBlock) continue;

    try {
      const data = yaml.load(yamlBlock) as Record<string, any>;
      if (!data || typeof data !== "object" || !data.slug || !data.title) continue;

      const bodyEnd = d + 2 < dashLines.length ? dashLines[d + 2] : lines.length;
      const body = lines.slice(closeLine + 1, bodyEnd).join("\n").trim();

      terms.push({
        slug: data.slug,
        title: data.title,
        definition: data.description || "",
        category,
        aliases: data.aliases,
        content: body || undefined,
      });

      d++;
    } catch {
      continue;
    }
  }
  return terms;
}

export function getAllTerms(): Term[] {
  if (cached) return cached;

  const dir = path.join(ROOT, "terminologies");
  if (!fs.existsSync(dir)) return [];

  const terms: Term[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (/\.ya?ml$/.test(file)) {
      const category = file.replace(/\.ya?ml$/, "");
      terms.push(...parseYmlTerms(filePath, category));
    } else if (/\.mdx?$/.test(file)) {
      const category = file.replace(/\.mdx?$/, "");
      terms.push(...parseMdxTerms(filePath, category));
    }
  }

  cached = terms;
  return terms;
}

let slugIndex: Map<string, Term> | null = null;

export function getTermBySlug(slug: string): Term | undefined {
  if (!slugIndex) {
    slugIndex = new Map();
    for (const term of getAllTerms()) {
      slugIndex.set(term.slug, term);
      term.aliases?.forEach((alias) => slugIndex!.set(alias.toLowerCase(), term));
    }
  }
  return slugIndex.get(slug) || slugIndex.get(slug.toLowerCase());
}

export function getTermCategories(): string[] {
  return [...new Set(getAllTerms().map((t) => t.category))];
}
