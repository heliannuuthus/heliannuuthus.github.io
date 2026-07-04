import { cn } from "@/lib/cn";

interface RevealTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delayStep?: number;
}

export default function RevealText({
  text,
  className,
  wordClassName,
  delayStep = 45
}: RevealTextProps) {
  const words = text.split(/(\s+)/);
  let wordIndex = 0;

  return (
    <span className={cn("rb-reveal-text", className)} aria-label={text}>
      {words.map((word, index) => {
        if (/^\s+$/.test(word)) {
          return <span key={`${word}-${index}`}>{word}</span>;
        }

        const delay = wordIndex++ * delayStep;
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden="true"
            className={cn("rb-reveal-word", wordClassName)}
            style={{ "--rb-reveal-delay": `${delay}ms` } as React.CSSProperties}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
