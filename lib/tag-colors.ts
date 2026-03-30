export const TAG_PALETTE = [
  "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
  "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
  "bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400",
  "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  "bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-400",
  "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-400",
  "bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-400",
  "bg-pink-500/10 text-pink-600 dark:bg-pink-400/15 dark:text-pink-400",
  "bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-400",
  "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400",
  "bg-lime-500/10 text-lime-600 dark:bg-lime-400/15 dark:text-lime-400",
  "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400",
  "bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-400/15 dark:text-fuchsia-400"
];

export const tagColor = (tag: string): string => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash + tag.charCodeAt(i)) | 0;
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
};
