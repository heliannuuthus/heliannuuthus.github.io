import { compile } from "@mdx-js/mdx";
import remarkExternalLink, { ExternalLinkOptions } from "./index";
import { describe, it, expect } from "vitest";
import { Link } from "mdast";

describe("remarkExternalLink 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          [
            remarkExternalLink,
            {
              href: "/external-link",
              target: "_blank",
              rel: ["nofollow", "noopener", "noreferrer"],
              test: (node: Link) => {
                return node.url.startsWith("http");
              },
            },
          ],
        ],
        rehypePlugins: [],
        jsx: true,
      })
    ).toString();
  };

  it("应该转换 MDX 文件中的外部链接", async () => {
    const output = await process("[Example](https://example.com)");

    expect(output).toContain('href="/external-link?href=https://example.com"');
    expect(output).toContain('target="_blank"');
    expect(output).toContain('rel="nofollow noopener noreferrer"');
  });
});
