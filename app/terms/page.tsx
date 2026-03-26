import { getAllTerms } from "@/lib/terms";
import { renderAllTerms } from "@/lib/term-renderer";
import TermsContent from "@/components/terms-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminology"
};

export default async function TermsPage() {
  const raw = getAllTerms();
  const terms = await renderAllTerms(raw);
  return <TermsContent terms={terms} />;
}
