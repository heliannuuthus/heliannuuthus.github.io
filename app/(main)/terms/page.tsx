import { getAllTerms, getTermCategories, getCategoryLabels } from "@/lib/terms";
import { buildCategoryMeta } from "@/lib/category-meta";
import { compileToHtml } from "@/lib/compile-mdx";
import TermsContent from "@/components/TermsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminology"
};

async function renderBlock(markdown: string, src: string): Promise<string | undefined> {
  try {
    return await compileToHtml(markdown, { source: src });
  } catch (e) {
    console.warn(`\x1b[33m⚠ [term]\x1b[0m Failed to compile content — ${src}`, e);
    return undefined;
  }
}

export default async function TermsPage() {
  const terms = getAllTerms();

  const rendered: Record<string, { definition?: string; content?: string }> = {};

  await Promise.all(
    terms.map(async (term) => {
      const src = `terminologies/${term.category}#${term.slug}`;
      const [definition, content] = await Promise.all([
        term.definition ? renderBlock(term.definition, src) : undefined,
        term.content ? renderBlock(term.content, src) : undefined,
      ]);
      rendered[term.slug] = { definition, content };
    })
  );

  const categoryMeta = buildCategoryMeta(getTermCategories(), getCategoryLabels());

  return <TermsContent terms={terms} rendered={rendered} categoryMeta={categoryMeta} />;
}
