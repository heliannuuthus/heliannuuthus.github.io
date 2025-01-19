interface TermMetadata {
  slug: string;
  title: string;
  description: string;
  authors: string[];
}
interface TermData {
  metadata: TermMetadata;
  content: string;
}
declare class TerminologyStore {
  terms: Record<string, Record<string, TermData>>;
  updated: string[];
  private static instance;
  constructor();
  addTerm(
    resourcePath: string,
    metadata: Record<string, TermData>,
  ): {
    resourcePath: string;
  };
  readGlossary(): Record<string, Record<string, TermData>>;
  setUpdatedResourcePath(resourcePath: string): void;
  clearUpdatedResourcePaths(): void;
  static getInstance(): TerminologyStore;
}
declare const store: TerminologyStore;

export { type TermData, type TermMetadata, store };
