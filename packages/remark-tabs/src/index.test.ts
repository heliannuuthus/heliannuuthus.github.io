/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compile } from "@mdx-js/mdx";
import remarkDirective from "remark-directive";
import { describe, expect, it } from "vitest";

import remarkTabs from "./index";

describe("remarkTabs 插件 (MDX 编译测试)", () => {
  const process = async (content: string) => {
    return (
      await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [remarkDirective, [remarkTabs]],
        rehypePlugins: [],
        jsx: true
      })
    ).toString();
  };

  it("正常转换为 Tabs 组件", async () => {
    const md = `:::::tabs
    ::::tab{title="Tab 1"}
    \`\`\`tsx
    const Tab1 = () => {
      return <div>Tab 1</div>;
    };
    \`\`\`
    ::::tabs

    :::tab{title="Sub Tab 1"}
    * List Item 1
    * *List Item 2*
    * **List Item 3**
    :::

    ::::

    ::::tab{title="Tab 2"}
    ::::

    :::::`;
    const output = await process(md);
    expect(output).toContain("<Tabs");
    expect(output).toContain(`<_components.tab title="Tab 1">`);
    expect(output).toContain(
      `<_components.pre><_components.code className="language-tsx">`
    );
    expect(output).toContain(
      `<_components.li>{"List Item 1"}</_components.li>`
    );
    expect(output).toContain(
      `<_components.li><_components.em>{"List Item 2"}</_components.em></_components.li>`
    );
    expect(output).toContain(
      `<_components.li><_components.strong>{"List Item 3"}</_components.strong></_components.li>`
    );
    expect(output).toContain(
      `<_components.li><_components.strong>{"List Item 3"}</_components.strong></_components.li>`
    );
    expect(output).toContain(`<_components.tab title="Sub Tab 1">`);
    expect(output).toContain(`<_components.tab title="Tab 2" />`);
  });
});
