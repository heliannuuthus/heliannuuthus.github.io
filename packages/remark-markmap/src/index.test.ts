import { compile } from "@mdx-js/mdx";
import { describe, expect, it } from "vitest";

import remarkMarkmap from "./index";

describe("remarkMarkmap 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          [
            remarkMarkmap,
            {
              markmap: "Markmap"
            }
          ]
        ],
        rehypePlugins: [],
        jsx: true
      })
    ).toString();
  };

  it("正常转换为 Markmap 组件", async () => {
    const md = ["```markmap", "# 标题", "- A", "  - B", "```"].join("\n");
    const output = await process(md);
    expect(output).toContain("<Markmap");
    expect(output).toContain("# 标题\n- A\n  - B");
  });
});
