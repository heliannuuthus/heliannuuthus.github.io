import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";

import remarkTables from "./index";

describe("remarkTables 插件测试", () => {
  const process = async (content: string, options = {}) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [remarkGfm, [remarkTables, options]],
        rehypePlugins: [],
        jsx: true
      })
    ).toString();
  };

  it("应该将简单表格转换为 Table 组件", async () => {
    const markdown = `
| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
    `.trim();

    const output = await process(markdown);
    expect(output).toContain("<Table");
    expect(output).toContain('<_components.th>{"年龄"}</_components.th>');
    expect(output).toContain('<_components.th>{"城市"}</_components.th>');
    expect(output).toContain('<_components.th>{"姓名"}</_components.th>');
    expect(output).toContain('<_components.td>{"张三"}</_components.td>');
    expect(output).toContain('<_components.td>{"李四"}</_components.td>');
    expect(output).toContain('<_components.td>{"北京"}</_components.td>');
    expect(output).toContain('<_components.td>{"上海"}</_components.td>');
    expect(output).toContain('<_components.td>{"25"}</_components.td>');
    expect(output).toContain('<_components.td>{"30"}</_components.td>');
  });

  it("应该处理带对齐的表格", async () => {
    const markdown = `
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 内容1  | 内容2 | 内容3  |
    `.trim();

    const output = await process(markdown);
    expect(output).toContain('align="left"');
    expect(output).toContain('align="center"');
    expect(output).toContain('align="right"');
  });

  it("应该处理空表头", async () => {
    const markdown = `
|   | 列2 |   |
|---|-----|---|
| A | B   | C |
    `.trim();

    const output = await process(markdown);
    expect(output).toContain('<_components.th>{"Column 1"}</_components.th>');
    expect(output).toContain('<_components.th>{"列2"}</_components.th>');
    expect(output).toContain('<_components.th>{"Column 3"}</_components.th>');
    expect(output).toContain('<_components.td>{"A"}</_components.td>');
    expect(output).toContain('<_components.td>{"B"}</_components.td>');
    expect(output).toContain('<_components.td>{"C"}</_components.td>');
  });

  it("应该处理包含内联代码的表格", async () => {
    const markdown = `
| 方法 | 描述 |
|------|------|
| \`get()\` | 获取值 |
| \`set()\` | 设置值 |
    `.trim();

    const output = await process(markdown);
    expect(output).toContain("get()");
    expect(output).toContain("set()");
  });

  it("应该支持自定义组件名", async () => {
    const markdown = `
| A | B |
|---|---|
| 1 | 2 |
    `.trim();

    const output = await process(markdown, { component: "CustomTable" });
    expect(output).toContain("<CustomTable");
    expect(output).toContain('<_components.th>{"A"}</_components.th>');
    expect(output).toContain('<_components.th>{"B"}</_components.th>');
    expect(output).toContain('<_components.td>{"1"}</_components.td>');
    expect(output).toContain('<_components.td>{"2"}</_components.td>');
  });

  it("应该处理空表格", async () => {
    const markdown = `
| 标题 |
|------|
    `.trim();

    const output = await process(markdown);
    expect(output).toContain("<Table");
    expect(output).toContain('<_components.th>{"标题"}</_components.th>');
  });
});
