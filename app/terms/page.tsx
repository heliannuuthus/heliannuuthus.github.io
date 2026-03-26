import { getAllTerms } from "@/lib/terms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminology"
};

export default function TermsPage() {
  const terms = getAllTerms();

  const grouped = terms.reduce<Record<string, typeof terms>>((acc, term) => {
    (acc[term.category] ||= []).push(term);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    auth: "Authentication",
    crypto: "Cryptography",
    dl: "Deep Learning",
    java: "Java",
    k8s: "Kubernetes",
    math: "Mathematics",
    net: "Networking",
    os: "Operating System",
    web: "Web"
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Terminology</h1>
        <p className="text-default-500 text-base">
          A glossary of technical terms referenced across blog posts.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
            {categoryLabels[category] || category}
            <span className="inline-flex items-center h-5 px-2 text-xs font-medium border border-default-200 rounded-full">
              {items.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((term) => (
              <div
                key={`${category}-${term.slug}`}
                className="glass rounded-2xl p-4 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-sm">{term.title}</h3>
                {term.description && (
                  <p className="text-xs text-default-500 mt-1 line-clamp-2 leading-relaxed">
                    {term.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {terms.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center text-default-400">
          No terminology entries yet.
        </div>
      )}
    </div>
  );
}
