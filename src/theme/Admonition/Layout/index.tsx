import clsx from "clsx";
import React, { ReactNode } from "react";

import { ThemeClassNames } from "@docusaurus/theme-common";

import type { Props } from "@theme/Admonition/Layout";

import styles from "./styles.module.css";

function AdmonitionContainer({
  type,
  className,
  children
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
      {title ? (
        React.isValidElement(title) &&
        typeof title.props.children === "string" ? (
          title.props.children === type ? null : (
            title
          )
        ) : typeof title === "string" ? (
          <AdmonitionHeading title={title} />
        ) : null
      ) : null}
      <AdmonitionBody icon={icon}>{children}</AdmonitionBody>
    </AdmonitionContainer>
  );
}
