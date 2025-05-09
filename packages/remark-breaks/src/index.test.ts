import { compile } from "@mdx-js/mdx";
import remarkBreaks from "./index";
import { describe, it, expect } from "vitest";
import { Link, Nodes } from "mdast";

describe("remarkBreaks 插件测试", () => {
  const process = async (content: string, options = {}) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [[remarkBreaks, options]],
        rehypePlugins: [],
        jsx: true,
      })
    ).toString();
  };

  it("应该将普通换行符转换为 break 节点", async () => {
    const output = await process("第一行\n第二行");
    expect(output).toContain(
      '<_components.p>{"第一行"}<_components.br />{"\\n"}{"第二行"}</_components.p>',
    );
  });

  it("应该将行尾带反斜杠的换行视为行继续", async () => {
    const output = await process(`第一行\\\n第二行`);
    expect(output).toContain('{"第一行"}{"第二行"}');
    expect(output).not.toContain("<_components.br />");
  });

  it("应该处理不同类型的换行符", async () => {
    const output = await process("第一行\r\n第二行\r第三行");
    expect(output).toContain(
      '<_components.p>{"第一行"}<_components.br />{"\\n"}{"第二行"}<_components.br />{"\\n"}{"第三行"}</_components.p>',
    );
  });

  it("应该支持忽略特定节点", async () => {
    const output = await process("第一行\n第二行", {
      ignore: (node: Nodes) => node.type === "paragraph",
    });
    expect(output).not.toContain("break");
  });
});
