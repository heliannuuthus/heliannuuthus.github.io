import AdmonitionTypeCaution from "@theme-original/Admonition/Type/Caution";
import AdmonitionTypeInfo from "@theme-original/Admonition/Type/Info";
import type AdmonitionTypes from "@theme-original/Admonition/Types";
import DefaultAdmonitionTypes from "@theme-original/Admonition/Types";
import React from "react";

import AdmonitionTypeNerd from "@site/src/theme/Admonition/Type/Nerd";
import AdmonitionTypeThinking from "@site/src/theme/Admonition/Type/Thinking";

import AdmonitionTypeNote from "@theme/Admonition/Type/Note";
import AdmonitionTypeTip from "@theme/Admonition/Type/Tip";

const admonitionTypes: typeof AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  thinking: AdmonitionTypeThinking,
  nerd: AdmonitionTypeNerd
};

// Undocumented legacy admonition type aliases
// Provide hardcoded/untranslated retrocompatible label
// See also https://github.com/facebook/docusaurus/issues/7767
const admonitionAliases: typeof AdmonitionTypes = {
  secondary: (props) => <AdmonitionTypeNote title="secondary" {...props} />,
  important: (props) => <AdmonitionTypeInfo title="important" {...props} />,
  success: (props) => <AdmonitionTypeTip title="success" {...props} />,
  caution: AdmonitionTypeCaution
};

export default {
  ...admonitionTypes,
  ...admonitionAliases
};
