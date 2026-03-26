import { Link as HeroLink } from "@heroui/react/link";
import { Separator } from "@heroui/react/separator";
import Link from "next/link";

export default function GlassFooter() {
  return (
    <footer className="w-full mt-auto">
      <div className="surface rounded-t-[24px]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <span className="text-lg font-semibold tracking-tight">
                heliannuuthus
              </span>
              <span className="text-sm text-default-500">
                Backend Engineer
              </span>
            </div>

            <div className="flex gap-6">
              <HeroLink
                href="https://github.com/heliannuuthus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-500 hover:text-accent text-sm transition-colors"
              >
                GitHub
              </HeroLink>
              <Link
                href="/blog"
                className="text-default-500 hover:text-accent text-sm transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/essay"
                className="text-default-500 hover:text-accent text-sm transition-colors"
              >
                Essay
              </Link>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center text-xs text-default-400">
            &copy; {new Date().getFullYear()} heliannuuthus. Built with Next.js
            &amp; HeroUI.
          </div>
        </div>
      </div>
    </footer>
  );
}
