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
    const input = "这是一个[[ tooltip 内容| 提示]]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title=" 提示">');
    expect(output).toContain(
      '<Comment type="secondary">{" tooltip 内容"}</Comment>'
    );
  });

  test("应该处理多行内容", async () => {
    const input = `这是一个[[多行
内容|多行
标题]]`;
    const output = await process(input);
    expect(output).toContain(`<Tooltip title="多行\n标题">`);
    expect(output).toContain(
      `<Comment type="secondary">{"多行\\n内容"}</Comment>`
    );
  });

  test("应该忽略不匹配的语法", async () => {
    const input = "这是普通文本 [[ 不完整的语法";
    const output = await process(input);
    expect(output).toContain("这是普通文本 [[ 不完整的语法");
    const input1 = "这是普通文本 [[ 不完整的语法 | 不完整的语法";
    const output1 = await process(input1);
    expect(output1).toContain("这是普通文本 [[ 不完整的语法 | 不完整的语法");
  });

  test("应该处理多个 tooltip", async () => {
    const input = "第一个[[内容1|提示1]] 第二个[[内容2|提示2]]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="提示1">');
    expect(output).toContain('<Comment type="secondary">{"内容1"}</Comment>');
    expect(output).toContain('<Tooltip title="提示2">');
    expect(output).toContain('<Comment type="secondary">{"内容2"}</Comment>');
  });

  test("应该处理包含特殊字符的内容", async () => {
    const input = "[[包含 * ! @ # $ 的内容|特殊*字符!]]";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="特殊*字符!">');
    expect(output).toContain(
      '<Comment type="secondary">{"包含 * ! @ # $ 的内容"}</Comment>'
    );
  });
});
