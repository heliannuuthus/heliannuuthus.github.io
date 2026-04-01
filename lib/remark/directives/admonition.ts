import { visit, setHast, wrapChildren, escapeHtml } from "./utils";

const ADMONITION_TYPES = ["tip", "note", "warning", "danger", "info", "caution", "nerd"];

const icon = (paths: string) =>
  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const CONFIG: Record<string, { accent: string; bg: string; svg: string }> = {
  note: {
    accent: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/5 dark:bg-blue-400/5",
    svg: icon('<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>'),
  },
  tip: {
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/5 dark:bg-emerald-400/5",
    svg: icon('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  },
  warning: {
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/5 dark:bg-amber-400/5",
    svg: icon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  },
  danger: {
    accent: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/5 dark:bg-red-400/5",
    svg: icon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>'),
  },
  info: {
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/5 dark:bg-sky-400/5",
    svg: icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  },
  caution: {
    accent: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/5 dark:bg-orange-400/5",
    svg: icon('<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>'),
  },
  nerd: {
    accent: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/5 dark:bg-violet-400/5",
    svg: icon('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>'),
  },
};

export const remarkAdmonition = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective") return;
    if (!ADMONITION_TYPES.includes(node.name)) return;

    const style = CONFIG[node.name] || CONFIG.note;
    let title = node.name.charAt(0).toUpperCase() + node.name.slice(1);

    node.children = node.children.filter((child: any) => {
      if (child.data?.directiveLabel && child.children?.[0]?.type === "text") {
        title = child.children[0].value;
        return false;
      }
      return true;
    });

    const contentChildren = [...node.children];

    const titleHtml = {
      type: "html",
      value: `<div class="flex items-center gap-2 mb-2 text-[13px] font-semibold tracking-wide ${style.accent}">${style.svg}<span>${escapeHtml(title)}</span></div>`,
    };

    const contentWrapper = wrapChildren(
      "div",
      { className: "text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0" },
      contentChildren
    );

    setHast(node, "div", { className: `rounded-2xl px-5 py-4 my-5 ${style.bg}` }, [titleHtml, contentWrapper]);
  });
};
