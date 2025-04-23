import { compile } from "node_modules/@mdx-js/mdx/lib/compile";
import { describe, expect, it } from "vitest";

import { CollapseHeadingOptions } from "./index";
import { plugin, preprocessorPlugin } from "./index";

describe("remark-collapse-heading", () => {
  const process = async (content: string) => {
    const file = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [preprocessorPlugin, plugin],
      rehypePlugins: [],
      jsx: true
    });

    return file.toString();
  };

  it("should transform headings into collapsible components", async () => {
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

    // 检查标题是否被转换为 Collapse 组件
      expect(result).toContain('<CollapseHeading title="Title 1" level="1"');
    expect(result).toContain('<CollapseHeading title="Title 2" level="2"');
    expect(result).toContain('<CollapseHeading title="Title 3" level="3"');
    expect(result).toContain('<CollapseHeading title="Title 4" level="4"');
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
          preprocessorPlugin,
          [plugin, { component: "CustomCollapse" } as CollapseHeadingOptions]
        ],
        rehypePlugins: [],
        jsx: true
      });
      return file.toString();
    };
    const output = await process(input);
    const result = String(output);

    expect(result).toContain('<CustomCollapse title="Custom Title" level="2"');
  });

  it("should handle collapsed headings", async () => {
    const input = `
## - Title 2
Content
`;
    const output = await process(input);
    const result = String(output);
    expect(result).toContain(
      '<CollapseHeading title="Title 2" level="2" collapsed'
    );
  });

  it("should process nested collapsed headings", async () => {
    const input = `
# - Parent Title
## - Child Title
Content
### - Grandchild Title
More content
`;
    const output = await process(input);
    const result = String(output);

    expect(result).toContain(
      '<CollapseHeading title="Parent Title" level="1" collapsed'
    );
    expect(result).toContain(
      '<CollapseHeading title="Child Title" level="2" collapsed'
    );
    expect(result).toContain(
      '<CollapseHeading title="Grandchild Title" level="3" collapsed'
    );
  });
});
