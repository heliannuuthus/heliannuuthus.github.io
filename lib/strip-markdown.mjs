export function stripMarkdown(text) {
  return text
    .replace(/^\s*import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*?)]\([^)]*\)/g, "$1")
    .replace(/:(?:term|hint)\[([^\]]*?)]\{[^}]*\}/g, "$1")
    .replace(/[*_~`#>|]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}
