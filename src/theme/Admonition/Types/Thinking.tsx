/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import type { Props } from "@theme/Admonition";
import AdmonitionLayout from "@theme/Admonition/Layout";
import IconInfo from "@theme/Admonition/Icon/Info";

const infimaClassName = "alert alert--thinking";

const defaultProps = {
  icon: <IconInfo />,
  title: (
    <Translate
      id="theme.admonition.thinking"
      description="The default label used for the Thinking admonition (:::thinking)"
    >
      thinking
    </Translate>
  ),
};

export default function AdmonitionTypeThinking(props: Props): ReactNode {
  return (
    <AdmonitionLayout
      {...defaultProps}
      {...props}
      className={clsx(infimaClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  );
}
