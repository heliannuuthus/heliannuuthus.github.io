import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";

import type { Props } from "@theme/Admonition/Layout";

import styles from "./styles.module.css";

function AdmonitionContainer({
  type,
  className,
  children,
}: Pick<Props, "type" | "className"> & { children: ReactNode }) {
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        styles.admonition,
        className
      )}
    >
      {children}
    </div>
  );
}

function AdmonitionHeading({ title }: Pick<Props, "title">) {
  return <div className={styles.admonitionHeading}>{title}</div>;
}

function AdmonitionBody({ icon, children }: Pick<Props, "icon" | "children">) {
  return children ? (
    <div className={styles.admonitionBody}>
      <div className={styles.admonitionIcon}>{icon}</div>
      <div className={styles.admonitionContent}>{children}</div>
    </div>
  ) : null;
}

export default function AdmonitionLayout(props: Props): ReactNode {
  const { type, icon, title, children, className } = props;
  return (
    <AdmonitionContainer type={type} className={className}>
      {title && title?.props.children !== type ? (
        <AdmonitionHeading title={title} />
      ) : null}
      <AdmonitionBody icon={icon}>{children}</AdmonitionBody>
    </AdmonitionContainer>
  );
}
