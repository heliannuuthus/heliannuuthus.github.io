interface HintProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Hint({ title, children }: HintProps) {
  return (
    <span className="group/hint relative">
      <span className="text-sky-500 dark:text-sky-400 border-b border-dashed border-sky-400/40 dark:border-sky-400/40 cursor-help">
        {children}
      </span>
      {title && (
        <span
          role="tooltip"
          className="
            pointer-events-none invisible opacity-0
            group-hover/hint:pointer-events-auto group-hover/hint:visible group-hover/hint:opacity-100
            transition-all duration-150
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max
          "
        >
          <span className="block rounded-lg px-3 py-2 max-w-60 text-left bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/10 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/10">
            <span className="block text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              {title}
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
