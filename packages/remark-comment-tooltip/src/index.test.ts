import { describe, expect, test } from "vitest";
import { compile } from "@mdx-js/mdx";
import remarkCommentTooltip from ".";
import remarkDirective from "remark-directive";

describe("remark-comment-tooltip", () => {
  const process = async (content: string) => {
    const file = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkDirective, remarkCommentTooltip],
      rehypePlugins: [],
      jsx: true,
    });

    return file.toString();
  };

  test("应该正确转换简单的 tooltip 语法", async () => {
    const input = "这是一个:ctip[ tooltip 内容]{title=' 提示'}";
    const output = await process(input);
    expect(output).toContain('<Tooltip title=" 提示">');
    expect(output).toContain('<Comment>{" tooltip 内容"}</Comment>');
  });

  test("应该处理多行内容", async () => {
    const input = `这是一个:ctip[多行
内容]{title="多行
标题"}`;
    const output = await process(input);
    console.log(output);
    expect(output).toContain(`<Tooltip title="多行\n标题">`);
    expect(output).toContain(`<Comment>{"多行\\n内容"}</Comment>`);
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
    const input =
      "第一个:ctip[内容1]{title='提示1'} 第二个:ctip[内容2]{title='提示2'}";
    const output = await process(input);
    expect(output).toContain('<Tooltip title="提示1">');
    expect(output).toContain('<Comment>{"内容1"}</Comment>');
    expect(output).toContain('<Tooltip title="提示2">');
    expect(output).toContain('<Comment>{"内容2"}</Comment>');
  });

  test("应该处理包含特殊字符的内容", async () => {
    const input = `:ctip[包含 \\\\| * ! @ # $ 的内容]{title="特殊*|字符!"}`;
    const output = await process(input);
    console.log(output);
    expect(output).toContain('<Tooltip title="特殊*|字符!">');
    expect(output).toContain(
      '<Comment>{"包含 \\\\| * ! @ # $ 的内容"}</Comment>',
    );
  });

  test("应该处理嵌套的 markdown", async () => {
    const input = `:ctip[包含 \`markdown\` 的内容]{title="特殊*|字符!"}`;
    const output = await process(input);
    console.log(output);
    expect(output).toContain('<Tooltip title="特殊*|字符!">');
    expect(output).toContain(
      '<Comment>{"包含 "}<_components.code>{"markdown"}</_components.code>{" 的内容"}</Comment>',
    );
  });

  test("应该处理 id 属性", async () => {
    const input = `:ctip[内容]{#提示}`;
    const output = await process(input);
    expect(output).toContain('<Tooltip title="提示">');
    expect(output).toContain('<Comment>{"内容"}</Comment>');
  });
});
