/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clsx from "clsx";
import React, { type ReactNode } from "react";

import Translate from "@docusaurus/Translate";

import NerdIcon from "@site/src/theme/Admonition/Icon/Nerd";

import type { Props } from "@theme/Admonition";
import AdmonitionLayout from "@theme/Admonition/Layout";

const infimaClassName = "alert alert--nerd";

const defaultProps = {
  icon: <NerdIcon />,
  title: (
    <Translate
      id="theme.admonition.nerd"
      description="The default label used for the Nerd admonition (:::nerd)"
    >
      nerd
    </Translate>
  )
};

export default function AdmonitionTypeNerd(props: Props): ReactNode {
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
