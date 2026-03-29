import { cn } from "@/lib/cn";

interface TimelineItem {
  key?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items?: TimelineItem[];
  mode?: "left" | "right" | "alternate";
}

export default function Timeline({
  items = [],
  mode = "left",
}: TimelineProps) {
  return (
    <div className="my-4 relative">
      {items.map((item, index) => {
        const isAlternate = mode === "alternate";
        const isRight = mode === "right" || (isAlternate && index % 2 === 1);

        return (
          <div
            key={item.key ?? index}
            className={cn(
              "flex gap-3",
              isAlternate && "items-center",
              isRight && isAlternate && "flex-row-reverse text-right"
            )}
          >
            {isAlternate && (
              <div className={cn("flex-1", isRight ? "text-left" : "text-right")}>
                {isRight ? (
                  <div className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 py-2">
                    {item.children}
                  </div>
                ) : item.label ? (
                  <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 py-2">
                    {item.label}
                  </div>
                ) : null}
              </div>
            )}

            <div className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-2 ring-2 ring-white dark:ring-zinc-900"
                style={{ backgroundColor: item.color ?? "#10b981" }}
              />
              {index < items.length - 1 && (
                <div className="w-px flex-1 min-h-[24px] bg-default-200 dark:bg-default-100/10" />
              )}
            </div>

            {isAlternate ? (
              <div className={cn("flex-1", isRight ? "text-right" : "text-left")}>
                {isRight ? (
                  item.label ? (
                    <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 py-2">
                      {item.label}
                    </div>
                  ) : null
                ) : (
                  <div className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 py-2">
                    {item.children}
                  </div>
                )}
              </div>
            ) : (
              <div className="pb-4 min-w-0">
                {item.label && (
                  <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                    {item.label}
                  </div>
                )}
                {item.children && (
                  <div className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 mt-0.5">
                    {item.children}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
