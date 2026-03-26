import Link from "next/link";

interface TermPreviewProps {
  path?: string;
  anchor?: string;
  children?: React.ReactNode;
}

export default function TermPreview({ path, anchor, children }: TermPreviewProps) {
  const href = path ? `${path}${anchor || ""}` : anchor || "#";

  return (
    <Link
      href={href}
      className="inline text-emerald-600 dark:text-emerald-400 border-b border-dotted border-emerald-400/50 hover:border-emerald-400 transition-colors"
    >
      {children}
    </Link>
  );
}
