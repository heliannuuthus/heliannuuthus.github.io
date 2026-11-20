import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { readGlossary, type Term } from "@heliannuuthus/npm/glossary";

const ROOT = path.join(/* turbopackIgnore: true */ process.cwd());

let cached: Term[] | null = null;

export const getAllTerms = (): Term[] => {
  if (cached) return cached;

  const terms = readGlossary(path.join(ROOT, "terminologies"));
  cached = terms;
  return terms;
};

let slugIndex: Map<string, Term> | null = null;

export const getTermBySlug = (slug: string): Term | undefined => {
  if (!slugIndex) {
    slugIndex = new Map();
    for (const term of getAllTerms()) {
      slugIndex.set(term.slug, term);
      term.aliases?.forEach((alias) => slugIndex!.set(alias.toLowerCase(), term));
    }
  }
  return slugIndex.get(slug) || slugIndex.get(slug.toLowerCase());
};

export const getTermCategories = (): string[] =>
  [...new Set(getAllTerms().map((t) => t.category))];

let labelCache: Record<string, string> | null = null;

export const getCategoryLabels = (): Record<string, string> => {
  if (labelCache) return labelCache;
  const file = path.join(ROOT, "terminologies", "_categories.yml");
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, "utf-8");
  labelCache = (yaml.load(raw) as Record<string, string>) || {};
  return labelCache;
};
