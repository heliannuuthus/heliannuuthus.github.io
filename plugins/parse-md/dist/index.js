// src/index.ts
import { load } from "js-yaml";
var chunks = (arr, size) => {
  const chunks2 = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks2.push(arr.slice(i, i + size));
  }
  return chunks2;
};
var parse = (content) => {
  if (!content || typeof content !== "string") {
    return [{ metadata: {}, content: content || "" }];
  }
  try {
    const blocks = content
      .split(/^---$/m)
      .map((block) => block.trim())
      .filter(Boolean);
    if (blocks.length === 1) {
      return [{ metadata: {}, content: blocks[0] }];
    }
    return chunks(blocks, 2).map(([metaBlock, contentBlock = ""]) => {
      let metadata = {};
      try {
        metadata = metaBlock ? load(metaBlock) : {};
      } catch (metaError) {
        console.warn("Failed to parse metadata block:", metaError);
      }
      return { metadata, content: contentBlock };
    });
  } catch (error) {
    console.error("Failed to parse markdown:", error);
    return [{ metadata: {}, content }];
  }
};
export { parse };
//# sourceMappingURL=index.js.map
