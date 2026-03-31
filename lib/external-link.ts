const INTERNAL_DOMAIN = "heliannuuthus.com";

export function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    const url = new URL(href);
    return !url.hostname.endsWith(INTERNAL_DOMAIN);
  } catch {
    return false;
  }
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

export function thumbnailUrl(href: string): string {
  return `https://image.thum.io/get/width/512/crop/288/${encodeURI(href)}`;
}

export function parseUrl(href: string): { domain: string; displayUrl: string } | null {
  try {
    const url = new URL(href);
    const displayUrl =
      href.length > 60 ? href.slice(0, 57) + "…" : href;
    return { domain: url.hostname, displayUrl };
  } catch {
    return null;
  }
}
