import { cn } from "@/lib/cn";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delayStep?: number;
  startDelay?: number;
}

export default function SplitText({
  text,
  className,
  charClassName,
  delayStep = 24,
  startDelay = 0
}: SplitTextProps) {
  return (
    <span className={cn("rb-split-text", className)} aria-label={text}>
      {Array.from(text).map((char, index) => {
        const isSpace = /\s/.test(char);
        return (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            className={cn("rb-split-char", isSpace && "rb-split-space", charClassName)}
            style={
              {
                "--rb-split-delay": `${startDelay + index * delayStep}ms`
              } as React.CSSProperties
            }
          >
            {isSpace ? "\u00a0" : char}
          </span>
        );
      })}
    </span>
  );
}
