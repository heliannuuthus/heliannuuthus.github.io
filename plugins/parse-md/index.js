import { load } from "js-yaml";

/**
 * 将数组分割成指定大小的块
 */
const chunks = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * 解析 Markdown 文件内容
 * @param {string} content - Markdown 文件内容
 * @returns {{metadata: Object, content: string}[]} 解析后的 Markdown 块数组
 */
export const parseMD = (content) => {
  if (!content || typeof content !== "string") {
    return [{ metadata: {}, content: content || "" }];
  }

  try {
    const blocks = content
      .split(/^---$/m)
      .map((block) => block.trim())
      .filter(Boolean);

    if (blocks.length === 1) {
      return [
        {
          metadata: {},
          content: blocks[0],
        },
      ];
    }

    return chunks(blocks, 2).map(([metaBlock, contentBlock = ""]) => {
      let metadata = {};

      try {
        metadata = metaBlock ? load(metaBlock) : {};
      } catch (metaError) {
        console.warn("Failed to parse metadata block:", metaError);
      }

      return {
        metadata,
        content: contentBlock,
      };
    });
  } catch (error) {
    console.error("Failed to parse markdown:", error);
    return [{ metadata: {}, content: content }];
  }
};
