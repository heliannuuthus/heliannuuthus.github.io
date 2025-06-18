import AntdIcon from "@ant-design/icons";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";
import Admonition from "@theme-original/Admonition";
import React, { type ReactNode } from "react";

import type { WrapperProps } from "@docusaurus/types";

import {
  DangerIcon,
  InfoIcon,
  NerdIcon,
  NoteIcon,
  ThinkingIcon,
  TipIcon,
  WarningIcon
} from "@site/src/theme/Admonition/Icon";

import type AdmonitionType from "@theme/Admonition";

type Props = WrapperProps<typeof AdmonitionType>;

export const AdmonitionIcon = ({ style, ...props }: IconComponentProps) => {
  return (
    <AntdIcon
      {...props}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    />
  );
};

export default function AdmonitionWrapper(props: Props): ReactNode {
  switch (props.type) {
    case "note":
      return (
        <Admonition {...props} icon={<AdmonitionIcon component={NoteIcon} />} />
      );
    case "tip":
      return (
        <Admonition {...props} icon={<AdmonitionIcon component={TipIcon} />} />
      );
    case "info":
      return (
        <Admonition {...props} icon={<AdmonitionIcon component={InfoIcon} />} />
      );
    case "warning":
      return (
        <Admonition
          {...props}
          icon={<AdmonitionIcon component={WarningIcon} />}
        />
      );
    case "danger":
      return (
        <Admonition
          {...props}
          icon={<AdmonitionIcon component={DangerIcon} />}
        />
      );
    case "thinking":
      return (
        <Admonition
          {...props}
          icon={<AdmonitionIcon component={ThinkingIcon} />}
        />
      );
    case "nerd":
      return (
        <Admonition {...props} icon={<AdmonitionIcon component={NerdIcon} />} />
      );
    default:
      return <Admonition {...props} />;
  }
}
