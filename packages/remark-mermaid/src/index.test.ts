import { compile } from "@mdx-js/mdx";
import remarkMermaid from "./index";
import { describe, it, expect } from "vitest";
import { Link } from "mdast";
import remarkDirective from "remark-directive";

describe("remarkMermaid 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          remarkDirective,
          [
            remarkMermaid,
            {
              mermaid: "Mermaid",
            },
          ],
        ],
        rehypePlugins: [],
        jsx: true,
      })
    ).toString();
  };

  it("正常转换为 mermaid", async () => {
    const output = await process("```mermaid\ngraph TD\nA-->B\n```");
    expect(output).toContain("<Mermaid");
    expect(output).toContain("graph TD\nA-->B");
  });
});
