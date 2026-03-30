import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { stripMarkdown } from "../lib/strip-markdown.mjs";

const WIDTH = 1200;
const HEIGHT = 630;
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "covers");
const CACHE_DIR = path.join(ROOT, "node_modules", ".cache", "fonts");

const FONT_URLS = [
  "https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Regular.ttf",
  "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf",
];
const FONT_BOLD_URLS = [
  "https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Medium.ttf",
  "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Medium.ttf",
];
const HANDWRITING_URLS = [
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/longcang/LongCang-Regular.ttf",
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zhimangxing/ZhiMangXing-Regular.ttf",
];

const ACCENT_HUES = [160, 200, 35, 280, 340, 175, 50, 220, 310, 145, 25, 190];

function hashCode(str) {
  let h = 0;
  for (const ch of str) h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
  return h;
}

function extractHandwritingPhrase(content, maxLen = 120) {
  const truncateMatch = content.match(/<!--\s*truncate\s*-->/);
  const body = truncateMatch
    ? content.slice(truncateMatch.index + truncateMatch[0].length)
    : content;

  const paragraphs = body.split(/\n\n+/).filter((p) => {
    const t = p.trim();
    return (
      t &&
      !t.startsWith("import ") &&
      !t.startsWith("```") &&
      !t.startsWith("<") &&
      !t.startsWith("---")
    );
  });

  let collected = "";
  for (const para of paragraphs) {
    const plain = stripMarkdown(para);
    if (plain.length < 4) continue;
    if (collected) collected += " ";
    collected += plain;
    if (collected.length >= maxLen) break;
  }

  return collected.length > maxLen
    ? collected.slice(0, maxLen) + "…"
    : collected;
}

const el = (type, style, children) => ({
  type,
  props: { style, children },
});

function formatDateTitle(dateStr) {
  return dayjs(dateStr).format("YYYY年M月D日 随记");
}

function coverDesign(post) {
  const { date, slug, handwriting } = post;
  const title = formatDateTitle(date);
  const h = Math.abs(hashCode(slug));
  const accentHue = ACCENT_HUES[h % ACCENT_HUES.length];

  const dateStr = dayjs(date).format("YYYY年M月D日");

  const LINE_SPACING = 88;
  const FIRST_LINE_Y = 45;
  const MARGIN_X = 78;
  const TEXT_X = 98;
  const LINE_COUNT = 5;

  const ruledLines = Array.from({ length: LINE_COUNT }, (_, i) =>
    el("div", {
      position: "absolute",
      left: `${TEXT_X}px`,
      right: "55px",
      top: `${FIRST_LINE_Y + (i + 1) * LINE_SPACING}px`,
      height: "1px",
      background: "rgba(155, 185, 215, 0.28)",
    })
  );

  const penTipX = 700;
  const penTipY = 155;
  const angle = -32;

  const penParts = [
    el("div", {
      position: "absolute",
      left: `${penTipX}px`,
      top: `${penTipY}px`,
      width: "0",
      height: "0",
      display: "flex",
      alignItems: "center",
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0 0",
      filter: "drop-shadow(0 5px 14px rgba(0,0,0,0.22))",
    }, [
      el("div", {
        width: "3px",
        height: "3px",
        borderRadius: "9999px",
        background: "radial-gradient(circle, #1a1a4a 0%, rgba(25,25,60,0.25) 100%)",
        flexShrink: 0,
      }),
      el("div", {
        width: "30px",
        height: "5px",
        background: "linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 25%, #a8a8a8 50%, #d0d0d0 75%, #f0f0f0 100%)",
        borderRadius: "2px 0 0 2px",
        flexShrink: 0,
      }),
      el("div", {
        width: "16px",
        height: "9px",
        background: "linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 30%, #999 50%, #c0c0c0 70%, #e8e8e8 100%)",
        flexShrink: 0,
      }),
      el("div", {
        width: "14px",
        height: "11px",
        background: "linear-gradient(180deg, #2a2a2a 0%, #111 50%, #2a2a2a 100%)",
        flexShrink: 0,
      }),
      el("div", {
        width: "50px",
        height: "14px",
        background: "linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 25%, #1a1a1a 50%, #2d2d2d 75%, #4a4a4a 100%)",
        flexShrink: 0,
        borderRadius: "1px",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
      }),
      el("div", {
        width: "4px",
        height: "15px",
        background: "linear-gradient(180deg, #eee 0%, #bbb 30%, #999 50%, #bbb 70%, #eee 100%)",
        flexShrink: 0,
      }),
      el("div", {
        width: "220px",
        height: "14px",
        background: "linear-gradient(180deg, #484848 0%, #333 12%, #1e1e1e 45%, #111 60%, #1e1e1e 88%, #383838 100%)",
        flexShrink: 0,
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.06), inset 0 -2px 3px rgba(0,0,0,0.3)",
      }),
      el("div", {
        width: "16px",
        height: "14px",
        background: "linear-gradient(180deg, #444 0%, #222 40%, #111 70%, #222 100%)",
        borderRadius: "0 7px 7px 0",
        flexShrink: 0,
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
      }),
    ]),
  ];

  return el(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      position: "relative",
      overflow: "hidden",
      background: "#FFFFFF",
      fontFamily: "LXGW WenKai",
    },
    [
      el("div", {
        position: "absolute",
        left: `${MARGIN_X}px`,
        top: "36px",
        bottom: "0",
        width: "1.5px",
        background: "rgba(225, 85, 75, 0.18)",
      }),

      ...ruledLines,

      el("div", {
        position: "absolute",
        left: `${TEXT_X}px`,
        right: "60px",
        top: `${FIRST_LINE_Y + 10}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Handwriting",
        color: "rgba(28, 28, 48, 0.82)",
      }, [
        el("div", {
          fontSize: 58,
          lineHeight: `${LINE_SPACING}px`,
          textAlign: "center",
        }, title),

        el("div", {
          display: "flex",
          gap: "28px",
          fontSize: 34,
          lineHeight: `${LINE_SPACING}px`,
          color: "rgba(28, 28, 48, 0.42)",
        }, [
          el("span", {}, "heliannuuthus"),
          el("span", {}, dateStr),
        ]),
      ]),

      ...(handwriting
        ? [
            el("div", {
              position: "absolute",
              left: `${TEXT_X}px`,
              right: "200px",
              top: `${FIRST_LINE_Y + 10 + LINE_SPACING * 3}px`,
              fontFamily: "Handwriting",
              fontSize: 40,
              lineHeight: `${LINE_SPACING}px`,
              color: "rgba(28, 28, 48, 0.62)",
              textIndent: "2em",
            }, handwriting),
          ]
        : []),

      ...penParts,
    ]
  );
}

function getEssayPosts() {
  const essayDir = path.join(ROOT, "essay");
  if (!fs.existsSync(essayDir)) return [];

  const posts = [];

  for (const dir of fs.readdirSync(essayDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const ymMatch = dir.name.match(/^(\d{4}-\d{2})$/);
    if (!ymMatch) continue;

    const yearMonth = ymMatch[1];
    const monthDir = path.join(essayDir, dir.name);

    for (const file of fs.readdirSync(monthDir, { withFileTypes: true })) {
      if (!file.isFile() || !/\.(mdx?|MDX?)$/.test(file.name)) continue;
      const basename = path.basename(file.name, path.extname(file.name));
      const dayMatch = basename.match(/^(\d{1,2})$/);
      if (!dayMatch) continue;

      const day = dayMatch[1].padStart(2, "0");
      const date = `${yearMonth}-${day}`;
      const slug = date.replace(/-/g, "");
      const raw = fs.readFileSync(path.join(monthDir, file.name), "utf-8");

      posts.push({
        slug,
        date,
        handwriting: extractHandwritingPhrase(raw),
      });
    }
  }

  return posts;
}

async function fetchWithFallback(urls, label) {
  for (const url of urls) {
    try {
      console.log(`  Fetching ${label} from ${url}...`);
      const resp = await fetch(url, { redirect: "follow" });
      if (resp.ok) return Buffer.from(await resp.arrayBuffer());
      console.warn(`  ⚠ ${resp.status} from ${url}`);
    } catch (e) {
      console.warn(`  ⚠ Failed: ${e.message}`);
    }
  }
  throw new Error(`All URLs failed for ${label}`);
}

async function loadFonts() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const regularPath = path.join(CACHE_DIR, "LXGWWenKai-Regular.ttf");
  const boldPath = path.join(CACHE_DIR, "LXGWWenKai-Medium.ttf");
  const handPath = path.join(CACHE_DIR, "Handwriting.ttf");

  let regular, bold, hand;

  if (
    fs.existsSync(regularPath) &&
    fs.existsSync(boldPath) &&
    fs.existsSync(handPath)
  ) {
    console.log("  Using cached fonts.");
    regular = fs.readFileSync(regularPath);
    bold = fs.readFileSync(boldPath);
    hand = fs.readFileSync(handPath);
  } else {
    regular = await fetchWithFallback(FONT_URLS, "Regular font");
    bold = await fetchWithFallback(FONT_BOLD_URLS, "Medium font");
    hand = await fetchWithFallback(HANDWRITING_URLS, "Handwriting font");
    fs.writeFileSync(regularPath, regular);
    fs.writeFileSync(boldPath, bold);
    fs.writeFileSync(handPath, hand);
    console.log("  Fonts cached.");
  }

  return [
    { name: "LXGW WenKai", data: regular.buffer, weight: 400, style: "normal" },
    { name: "LXGW WenKai", data: bold.buffer, weight: 700, style: "normal" },
    { name: "Handwriting", data: hand.buffer, weight: 400, style: "normal" },
  ];
}

async function main() {
  console.log("Generating essay covers...");

  const posts = getEssayPosts();
  if (posts.length === 0) {
    console.log("No essay posts found, skipping.");
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Found ${posts.length} essay(s). Loading fonts...`);
  const fonts = await loadFonts();

  await Promise.all(
    posts.map(async (post) => {
      const design = coverDesign(post);
      const svg = await satori(design, { width: WIDTH, height: HEIGHT, fonts });
      const resvg = new Resvg(svg, {
        fitTo: { mode: "width", value: WIDTH },
      });
      const png = resvg.render().asPng();
      fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.png`), png);
      console.log(`  ✓ ${post.slug}.png`);
    })
  );

  console.log(`Done. Generated ${posts.length} cover(s).`);
}

main().catch((err) => {
  console.error("Cover generation failed:", err);
  process.exit(1);
});
