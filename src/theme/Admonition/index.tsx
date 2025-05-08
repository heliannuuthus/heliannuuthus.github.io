import React, { type ReactNode } from "react";
import Admonition from "@theme-original/Admonition";
import type AdmonitionType from "@theme/Admonition";
import type { WrapperProps } from "@docusaurus/types";
import NoteIcon from "@site/static/img/admonition/note.svg";
import TipIcon from "@site/static/img/admonition/tip.svg";
import InfoIcon from "@site/static/img/admonition/info.svg";
import WarningIcon from "@site/static/img/admonition/warning.svg";
import DangerIcon from "@site/static/img/admonition/danger.svg";
import AntdIcon from "@ant-design/icons";
import { IconComponentProps } from "@ant-design/icons/lib/components/Icon";

type Props = WrapperProps<typeof AdmonitionType>;

const Icon = ({ style, ...props }: IconComponentProps) => {
  return (
    <AntdIcon
      {...props}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
};

export default function AdmonitionWrapper(props: Props): ReactNode {
  switch (props.type) {
    case "note":
      return <Admonition {...props} icon={<Icon component={NoteIcon} />} />;
    case "tip":
      return <Admonition {...props} icon={<Icon component={TipIcon} />} />;
    case "info":
      return <Admonition {...props} icon={<Icon component={InfoIcon} />} />;
    case "warning":
      return <Admonition {...props} icon={<Icon component={WarningIcon} />} />;
    case "danger":
      return <Admonition {...props} icon={<Icon component={DangerIcon} />} />;
    default:
      return <Admonition {...props} />;
  }
}
