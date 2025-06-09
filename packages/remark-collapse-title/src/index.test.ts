import { describe, expect, it } from "vitest";
import remarkCollapseTitle, { PluginOptions } from "./index";
import { compile } from "node_modules/@mdx-js/mdx/lib/compile";
import remarkDirective from "remark-directive";

describe("remark-collapse-title", () => {
  const process = async (content: string) => {
    const file = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkCollapseTitle],
      rehypePlugins: [],
      jsx: true,
    });

    return file.toString();
  };
  it("should transform h2 and h3 headings into collapsible components", async () => {
    const input = `
# Title 1
## Title 2
Content under h2
### Title 3
Content under h3
#### Title 4
Content under h4
`;

    const output = await process(input);
    const result = String(output);

    // 检查 h2 和 h3 是否被转换为 Collapse 组件
    expect(result).toContain('<Collapse title="Title 2" level="2"');
    expect(result).toContain('<Collapse title="Title 3" level="3"');
    // 检查 h1 和 h4 是否保持不变
    expect(result).toContain('<_components.h1>{"Title 1"}</_components.h1>');
    expect(result).toContain('<_components.h4>{"Title 4"}</_components.h4>');
  });

  it("should respect custom component name", async () => {
    const input = `
## Custom Title
Content
`;
    const process = async (content: string) => {
      const file = await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          [
            remarkCollapseTitle,
            { component: "CustomCollapse" } as PluginOptions,
          ],
        ],
        rehypePlugins: [],
        jsx: true,
      });
      return file.toString();
    };
    const output = await process(input);
    const result = String(output);

    expect(result).toContain('<CustomCollapse title="Custom Title" level="2"');
  });

  it("should respect custom depth options", async () => {
    const input = `
# Title 1
Content under h1
## Title 2
Content under h2
### Title 3
Content under h3
#### Title 4
Content under h4
`;

    const process = async (content: string) => {
      const file = await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [
          [remarkCollapseTitle, { depth: [1, 4] } as PluginOptions],
        ],
        rehypePlugins: [],
        jsx: true,
      });
      return file.toString();
    };
    const output = await process(input);
    const result = String(output);

    expect(result).toContain('<Collapse title="Title 1" level="1"');
    expect(result).toContain('<Collapse title="Title 4" level="4"');
    // 检查 h2 和 h3 是否保持不变
    expect(result).toContain('<_components.h2>{"Title 2"}</_components.h2>');
    expect(result).toContain('<_components.h3>{"Title 3"}</_components.h3>');
  });
});
