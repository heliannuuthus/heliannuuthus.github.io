import { cn } from "@/lib/cn";

interface ShinyTextProps {
  text: string;
  className?: string;
}

export default function ShinyText({ text, className }: ShinyTextProps) {
  return (
    <span className={cn("rb-shiny-text", className)} aria-label={text}>
      {text}
    </span>
  );
}
