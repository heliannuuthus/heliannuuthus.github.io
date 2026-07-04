import { schemeTableau10 } from "d3-scale-chromatic";

export interface CategoryMeta {
  label: string;
  color: [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function buildCategoryMeta(
  categories: string[],
  labels: Record<string, string>,
): Record<string, CategoryMeta> {
  const sorted = [...categories].sort();
  const meta: Record<string, CategoryMeta> = {};
  for (let i = 0; i < sorted.length; i++) {
    const cat = sorted[i];
    meta[cat] = {
      label: labels[cat] || cat,
      color: hexToRgb(schemeTableau10[i % schemeTableau10.length]),
    };
  }
  return meta;
}
