// MDXRenderer.jsx
import React, { useEffect, useState, Suspense } from "react";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import Term from "./TermPreview";

const components = {
  Term,
};

const MDXRender = ({ content }) => {
  const [Component, setComponent] = useState(() => () => null);

  useEffect(() => {
    (async () => {
      await evaluate(content, {
        ...runtime,
        useMDXComponents: () => components,
      }).then((exports) => {
        setComponent(() => exports.default);
      });
    })();
  }, [content]);

  if (!Component) {
    return (
      <MDXProvider components={components}>
        <div>unknown component</div>
      </MDXProvider>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </Suspense>
  );
};

export default MDXRender;
