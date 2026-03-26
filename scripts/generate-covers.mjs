import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function stripMarkdown(text) {
  return text
    .replace(/^\s*import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]*?)]\([^)]*\)/g, "$1")
    .replace(/:(?:term|hint)\[([^\]]*?)]\{[^}]*\}/g, "$1")
    .replace(/[*_~`#>|]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function extractExcerpt(content, maxLen = 100) {
  const truncateMatch = content.match(/<!--\s*truncate\s*-->/);
  const raw = truncateMatch
    ? content.slice(0, truncateMatch.index)
    : content.split(/\n\n/)[0] ?? "";
  const plain = stripMarkdown(raw);
  if (!plain) return "";
  return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
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

function coverDesign(post) {
  const { title, tags, date, slug, handwriting, author } = post;
  const h = Math.abs(hashCode(slug));
  const accentHue = ACCENT_HUES[h % ACCENT_HUES.length];
  const accentColor = `hsl(${accentHue}, 50%, 48%)`;

  const d = new Date(date);
  const dateStr = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

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
      // 墨点
      el("div", {
        width: "3px",
        height: "3px",
        borderRadius: "9999px",
        background: "radial-gradient(circle, #1a1a4a 0%, rgba(25,25,60,0.25) 100%)",
        flexShrink: 0,
      }),
      // Lamy 钢制笔尖 - 银色锥形
      el("div", {
        width: "30px",
        height: "5px",
        background: "linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 25%, #a8a8a8 50%, #d0d0d0 75%, #f0f0f0 100%)",
        borderRadius: "2px 0 0 2px",
        flexShrink: 0,
      }),
      // 笔尖座 - 宽银色
      el("div", {
        width: "16px",
        height: "9px",
        background: "linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 30%, #999 50%, #c0c0c0 70%, #e8e8e8 100%)",
        flexShrink: 0,
      }),
      // 进墨器
      el("div", {
        width: "14px",
        height: "11px",
        background: "linear-gradient(180deg, #2a2a2a 0%, #111 50%, #2a2a2a 100%)",
        flexShrink: 0,
      }),
      // Lamy 标志性三角握笔区 - 磨砂半透明黑
      el("div", {
        width: "50px",
        height: "14px",
        background: "linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 25%, #1a1a1a 50%, #2d2d2d 75%, #4a4a4a 100%)",
        flexShrink: 0,
        borderRadius: "1px",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
      }),
      // 银色环
      el("div", {
        width: "4px",
        height: "15px",
        background: "linear-gradient(180deg, #eee 0%, #bbb 30%, #999 50%, #bbb 70%, #eee 100%)",
        flexShrink: 0,
      }),
      // Lamy Safari 笔身 - ABS 磨砂黑
      el("div", {
        width: "220px",
        height: "14px",
        background: "linear-gradient(180deg, #484848 0%, #333 12%, #1e1e1e 45%, #111 60%, #1e1e1e 88%, #383838 100%)",
        flexShrink: 0,
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.06), inset 0 -2px 3px rgba(0,0,0,0.3)",
      }),
      // 尾部按钮 - Lamy 圆形尾端
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

      // 标题居中
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
          el("span", {}, author || "heliannuuthus"),
          el("span", {}, dateStr),
        ]),
      ]),

      // 正文摘录左对齐
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
  const dir = path.join(ROOT, "essay");
  if (!fs.existsSync(dir)) return [];

  const posts = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith("_")) walk(full);
      } else if (
        /\.(mdx?|MDX?)$/.test(entry.name) &&
        !entry.name.startsWith("_")
      ) {
        const raw = fs.readFileSync(full, "utf-8");
        const { data, content } = matter(raw);
        if (data.unlisted || data.draft) continue;

        const dirMatch = path.relative(ROOT, full).match(/(\d{4}-\d{2})/);
        const authors = Array.isArray(data.authors)
          ? data.authors
          : [data.authors || "heliannuuthus"];
        posts.push({
          slug: data.slug || entry.name.replace(/\.mdx?$/i, ""),
          title: data.title || entry.name.replace(/\.mdx?$/i, ""),
          date:
            data.date?.toString() ||
            (dirMatch ? `${dirMatch[1]}-01` : "1970-01-01"),
          tags: Array.isArray(data.tags) ? data.tags : [],
          description: data.description || extractExcerpt(content),
          author: authors[0],
          handwriting: extractHandwritingPhrase(content),
        });
      }
    }
  }

  walk(dir);
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
