import React, { type ReactNode } from "react";
import Footer from "@theme-original/BlogPostItem/Footer";
import type FooterType from "@theme/BlogPostItem/Footer";
import type { WrapperProps } from "@docusaurus/types";
import FeedbackWidget from "@site/src/components/FeedbackWidget";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      <Footer {...props} />
      <FeedbackWidget />
    </>
  );
}
