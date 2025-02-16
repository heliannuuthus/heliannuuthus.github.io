import { compile } from "@mdx-js/mdx";
import remarkTerminology from "./index";
import { describe, it, expect } from "vitest";
import { Link } from "mdast";
import remarkDirective from "remark-directive";

describe("remarkTerminology 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [remarkDirective, remarkTerminology],
        rehypePlugins: [],
        jsx: true,
      })
    ).toString();
  };

  it("正常转换为 term", async () => {
    const output = await process(":term[`hello`]{./path/to/file#anchor}");
    expect(output).toContain(
      '<TermPreview path="/path/to/file" anchor="#anchor">',
    );
    expect(output).toContain('<_components.code>{"hello"}</_components.code>');
    expect(output).toContain("</TermPreview>");
  });
});
