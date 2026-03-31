"use client";

import React from "react";
import { Link } from "@heroui/react/link";
import { Tooltip } from "@heroui/react/tooltip";
import { Globe } from "lucide-react";
import { useState } from "react";
import {
  parseUrl,
  faviconUrl,
  thumbnailUrl
} from "@/lib/external-link";

interface ExternalLinkProps {
  href: string;
  children?: React.ReactNode;
}

function hasNestedElements(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) found = true;
  });
  return found;
}

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const parsed = parseUrl(href);
  const domain = parsed?.domain ?? "";
  const displayUrl = parsed?.displayUrl ?? href;
  const goHref = `/go?target=${encodeURIComponent(href)}`;

  const trigger = (
    <Link
      href={goHref}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline underline-offset-4 text-[1em]"
    >
      {children}
      <Link.Icon />
    </Link>
  );

  if (!parsed || hasNestedElements(children)) return trigger;

  return (
    <Tooltip delay={0} closeDelay={150}>
      <Tooltip.Trigger className="!inline">{trigger}</Tooltip.Trigger>
      <Tooltip.Content
        placement="bottom"
        shouldFlip
        offset={8}
        className="p-0 bg-transparent border-none shadow-none rounded-2xl max-w-none"
      >
        <div className="w-72 surface-overlay rounded-2xl overflow-hidden">
          <div className="relative h-36 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            {!thumbError ? (
              <>
                {!thumbLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl(href)}
                  alt=""
                  className={`w-full h-full object-cover object-top transition-opacity duration-300 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setThumbLoaded(true)}
                  onError={() => setThumbError(true)}
                  loading="lazy"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-300 dark:text-zinc-600">
                <Globe className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {faviconError ? (
                <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={faviconUrl(domain)}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-sm shrink-0"
                  onError={() => setFaviconError(true)}
                />
              )}
              <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                {domain}
              </span>
            </div>

            <p
              className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500 break-all"
              title={href}
            >
              {displayUrl}
            </p>
          </div>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}
