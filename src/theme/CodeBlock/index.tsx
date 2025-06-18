import CodeBlock from "@theme-original/CodeBlock";
import React from "react";

import type { WrapperProps } from "@docusaurus/types";

import type CodeBlockType from "@theme/CodeBlock";

type Props = WrapperProps<typeof CodeBlockType>;

export default function CodeBlockWrapper(props: Props): JSX.Element {
  return (
    <>
      <CodeBlock {...props} />
    </>
  );
}
