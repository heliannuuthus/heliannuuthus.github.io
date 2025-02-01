import { describe, expect, test } from "vitest";
import { compile } from "@mdx-js/mdx";
import remarkTooltip from ".";

describe("remarkTooltip", () => {
  const process = async (content: string) => {
    const file = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkTooltip],
      rehypePlugins: [],
      jsx: true,
    });

    return file.toString();
  };

  test("应该正确转换简单的 tooltip 语法", async () => {
    const input = "这是一个[[提示]][ tooltip 内容]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="提示">');
    expect(output).toContain('<Text type="secondary">{" tooltip 内容"}</Text>');
  });

  test("应该处理多行内容", async () => {
    const input = `这是一个[[多行
    标题]][多行
    内容]`;
    const output = await process(input);
    expect(output).toContain(`{"这是一个[[多行\\n标题]][多行\\n内容]"}`);
  });

  test("应该忽略不匹配的语法", async () => {
    const input = "这是普通文本 [[ 不完整的语法";
    const output = await process(input);
    expect(output).toContain("这是普通文本 [[ 不完整的语法");
  });

  test("应该处理多个 tooltip", async () => {
    const input = "第一个[[提示1]][内容1] 第二个[[提示2]][内容2]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="提示1">');
    expect(output).toContain('<Text type="secondary">{"内容1"}</Text>');
    expect(output).toContain('<Tooltip title="提示2">');
    expect(output).toContain('<Text type="secondary">{"内容2"}</Text>');
  });

  test("应该处理包含特殊字符的内容", async () => {
    const input = "[[特殊*字符!]][包含 * ! @ # $ 的内容]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="特殊*字符!">');
    expect(output).toContain(
      '<Text type="secondary">{"包含 * ! @ # $ 的内容"}</Text>',
    );
  });
});
