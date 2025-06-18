import { compile } from "@mdx-js/mdx";
import { Link } from "mdast";
import remarkDirective from "remark-directive";
import { describe, expect, it } from "vitest";

import remarkAdmonition from "./index";

describe("remarkAdmonition 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          remarkDirective,
          [
            remarkAdmonition,
            {
              admonition: "Admonition",
              extension: {
                tips: {
                  icon: "💡💡",
                  type: "tips",
                  title: "tips"
                }
              }
            }
          ]
        ],
        rehypePlugins: [],
        jsx: true
      })
    ).toString();
  };

  it("正常转换为 admonition", async () => {
    const output = await process(":::tips\n  hello\n:::");
    expect(output).toContain(
      '<Admonition icon="💡💡" title="tips" type="tips">'
    );
    expect(output).toContain("hello");
    expect(output).toContain("</Admonition>");
  });

  it("覆盖默认配置 admonition", async () => {
    const output = await process(':::tips{title="good tip"}\n  hello\n:::');
    expect(output).toContain(
      '<Admonition icon="💡💡" title="good tip" type="tips">'
    );
    expect(output).toContain("hello");
    expect(output).toContain("</Admonition>");
  });

  it("解析 label admonition", async () => {
    const output = await process(":::tips[good tip]\n  hello\n:::");
    expect(output).toContain(
      '<Admonition icon="💡💡" title="good tip" type="tips">'
    );
    expect(output).toContain("hello");
    expect(output).toContain("</Admonition>");
  });
});
