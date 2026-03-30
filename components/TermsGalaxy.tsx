"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import type { Term } from "@/lib/terms";
import type { CategoryMeta } from "@/lib/category-meta";

/* ── Types ── */

interface GNode {
  term: Term;
  gi: number;
  orbit: number;
  angle: number;
  speed: number;
  x: number;
  y: number;
}

interface GCenter {
  category: string;
  label: string;
  color: [number, number, number];
  hx: number;
  hy: number;
  cx: number;
  cy: number;
  drift: { ax: number; ay: number; fx: number; fy: number; px: number; py: number }[];
}

interface Star {
  x: number;
  y: number;
  r: number;
  b: number;
  p: number;
}

interface Cam {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
}

/* ── Constants ── */

const FC: [number, number, number] = [161, 161, 170];
const FONT =
  '"LXGW WenKai","PingFang SC","Noto Sans SC",system-ui,sans-serif';
const STARS = 280;
const LERP_F = 0.07;

/* ── Helpers ── */

function rgba(c: [number, number, number], a = 1) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

function lp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function w2s(wx: number, wy: number, c: Cam, W: number, H: number) {
  return [(wx - c.x) * c.z + W / 2, (wy - c.y) * c.z + H / 2] as const;
}

function s2w(sx: number, sy: number, c: Cam, W: number, H: number) {
  return [(sx - W / 2) / c.z + c.x, (sy - H / 2) / c.z + c.y] as const;
}

function strip(md: string) {
  return md
    .replace(/:(?:term|hint)\[([^\]]*)\](?:\{[^}]*\})?/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Layout ── */

function seedHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h;
}

function seedRand(seed: number): () => number {
  let s = seed | 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return ((s >>> 0) / 0xffffffff);
  };
}

function layout(terms: Term[], w: number, h: number, catMeta: Record<string, CategoryMeta>) {
  const cats = [...new Set(terms.map((t) => t.category))].sort();
  const n = cats.length;
  const spread = Math.min(w, h) * 0.34;

  const centers: GCenter[] = cats.map((cat) => {
    const rng = seedRand(seedHash(cat));
    const angle = rng() * Math.PI * 2;
    const dist = spread * (0.35 + rng() * 0.65);
    const homeX = Math.cos(angle) * dist;
    const homeY = Math.sin(angle) * dist;
    const drift = Array.from({ length: 3 }, () => ({
      ax: 6 + rng() * 14,
      ay: 6 + rng() * 14,
      fx: (0.00005 + rng() * 0.00012) * (rng() > 0.5 ? 1 : -1),
      fy: (0.00005 + rng() * 0.00012) * (rng() > 0.5 ? 1 : -1),
      px: rng() * Math.PI * 2,
      py: rng() * Math.PI * 2,
    }));
    return {
      category: cat,
      label: catMeta[cat]?.label || cat,
      color: catMeta[cat]?.color || FC,
      hx: homeX,
      hy: homeY,
      cx: homeX,
      cy: homeY,
      drift,
    };
  });

  const minSep = 95;
  for (let iter = 0; iter < 60; iter++) {
    let settled = true;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = centers[j].cx - centers[i].cx;
        const dy = centers[j].cy - centers[i].cy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < minSep) {
          settled = false;
          const push = (minSep - d) * 0.5;
          const nx = dx / d;
          const ny = dy / d;
          centers[i].cx -= nx * push;
          centers[i].cy -= ny * push;
          centers[j].cx += nx * push;
          centers[j].cy += ny * push;
        }
      }
      const pull = 0.01;
      centers[i].cx *= 1 - pull;
      centers[i].cy *= 1 - pull;
    }
    if (settled) break;
  }

  const nodes: GNode[] = [];
  for (let gi = 0; gi < centers.length; gi++) {
    const ct = terms.filter((t) => t.category === centers[gi].category);
    const perRing = Math.max(3, Math.ceil(Math.sqrt(ct.length * 2.5)));
    const rings = Math.ceil(ct.length / perRing);
    const base = 40;
    const step = rings > 1 ? 30 : 0;

    ct.forEach((term, i) => {
      const ring = Math.floor(i / perRing);
      const pos = i % perRing;
      const cnt = Math.min(perRing, ct.length - ring * perRing);
      const orbit = base + ring * step;
      const angle = (pos / cnt) * Math.PI * 2 + ring * 0.4;
      const speed =
        ((0.04 + Math.random() * 0.08) / (1 + ring * 0.3)) *
        (i % 2 === 0 ? 1 : -1);

      nodes.push({ term, gi, orbit, angle, speed, x: 0, y: 0 });
    });
  }

  return { centers, nodes };
}

function stars(count: number, range: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * range * 2,
    y: (Math.random() - 0.5) * range * 2,
    r: Math.random() * 1.1 + 0.2,
    b: Math.random() * 0.5 + 0.15,
    p: Math.random() * Math.PI * 2,
  }));
}

/* ── Render functions ── */


function drawStars(
  ctx: CanvasRenderingContext2D,
  st: Star[],
  dk: boolean,
  t: number,
) {
  for (const s of st) {
    const tw = 0.5 + 0.5 * Math.sin(t * 0.0012 + s.p);
    const a = s.b * tw;
    ctx.fillStyle = dk
      ? `rgba(255,255,255,${a})`
      : `rgba(100,100,120,${a * 0.18})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOrbit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  col: [number, number, number],
  dk: boolean,
  alpha: number,
) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = dk
    ? rgba(col, 0.07 * alpha)
    : rgba(col, 0.1 * alpha);
  ctx.setLineDash([3, 5]);
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCenter(
  ctx: CanvasRenderingContext2D,
  c: GCenter,
  dk: boolean,
  t: number,
  idx: number,
  alpha: number,
) {
  const pulse = 1 + 0.05 * Math.sin(t * 0.0015 + idx * 1.1);
  const r = 8 * pulse;

  ctx.save();
  ctx.shadowColor = rgba(c.color, (dk ? 0.4 : 0.2) * alpha);
  ctx.shadowBlur = dk ? 12 : 8;
  ctx.fillStyle = rgba(c.color, (dk ? 0.9 : 0.7) * alpha);
  ctx.beginPath();
  ctx.arc(c.cx, c.cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  n: GNode,
  col: [number, number, number],
  dk: boolean,
  hov: boolean,
  matched: boolean,
  galAlpha: number,
) {
  const r = hov ? 4.5 : 2.8;
  const a = matched ? (hov ? 1 : 0.8) * galAlpha : 0.08 * galAlpha;

  if (dk && matched && a > 0.2) {
    ctx.save();
    ctx.shadowColor = rgba(col, hov ? 0.7 : 0.25);
    ctx.shadowBlur = hov ? 14 : 5;
    ctx.fillStyle = rgba(col, a);
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = rgba(col, a);
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTooltip(
  ctx: CanvasRenderingContext2D,
  n: GNode,
  col: [number, number, number],
  cam: Cam,
  W: number,
  H: number,
  dk: boolean,
) {
  const def = n.term.definition ? strip(n.term.definition) : "";
  const preview = def.length > 70 ? def.slice(0, 70) + "…" : def;
  const [sx, sy] = w2s(n.x, n.y, cam, W, H);

  const tw = Math.min(260, W - 32);
  const th = preview ? 56 : 34;
  let tx = sx + 14;
  let ty = sy - th - 14;
  if (tx + tw > W - 12) tx = sx - tw - 14;
  if (ty < 12) ty = sy + 18;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(tx, ty, tw, th, 10);
  ctx.fillStyle = dk ? "rgba(24,24,36,0.94)" : "rgba(255,255,255,0.96)";
  ctx.shadowColor = dk ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.roundRect(tx, ty, tw, th, 10);
  ctx.strokeStyle = dk
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.05)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.fillStyle = rgba(col);
  ctx.beginPath();
  ctx.arc(tx + 13, ty + 15, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `600 12.5px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillStyle = dk ? "#f4f4f5" : "#18181b";
  ctx.fillText(n.term.title, tx + 23, ty + 18.5);

  if (preview) {
    ctx.font = `400 10.5px ${FONT}`;
    ctx.fillStyle = dk ? "#a1a1aa" : "#71717a";
    ctx.fillText(preview, tx + 13, ty + 39, tw - 26);
  }
}

/* ── Component ── */

interface Props {
  terms: Term[];
  categoryMeta: Record<string, CategoryMeta>;
  matchingSlugs: Set<string> | null;
  selectedCategory: string | null;
  onSelectTerm: (t: Term) => void;
  onSelectCategory: (c: string | null) => void;
}

export default function TermsGalaxy({
  terms,
  categoryMeta,
  onSelectTerm,
}: Props) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const propsRef = useRef({
    dk: resolvedTheme === "dark",
    selCat: null as string | null,
  });
  propsRef.current.dk = resolvedTheme === "dark";

  const cbRef = useRef({ onSelectTerm });
  cbRef.current = { onSelectTerm };

  const st = useRef({
    cam: { x: 0, y: 0, z: 1, tx: 0, ty: 0, tz: 1 } as Cam,
    centers: [] as GCenter[],
    nodes: [] as GNode[],
    starField: [] as Star[],
    hover: -1,
    W: 0,
    H: 0,
    dpr: 1,
    drag: false,
    dsx: 0,
    dsy: 0,
    moved: false,
  });

  const zoomTo = useCallback((cat: string | null) => {
    const s = st.current;
    propsRef.current.selCat = cat;
    if (cat) {
      const c = s.centers.find((g) => g.category === cat);
      if (c) {
        s.cam.tx = c.hx;
        s.cam.ty = c.hy;
        s.cam.tz = 2.5;
      }
    } else {
      s.cam.tx = 0;
      s.cam.ty = 0;
      s.cam.tz = 1;
    }
  }, []);

  const initLayout = useCallback(() => {
    const el = boxRef.current;
    const cv = cvRef.current;
    if (!el || !cv) return;
    const rect = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const W = rect.width;
    const H = rect.height;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = `${W}px`;
    cv.style.height = `${H}px`;

    const s = st.current;
    s.W = W;
    s.H = H;
    s.dpr = dpr;

    const { centers, nodes } = layout(terms, W, H, categoryMeta);
    s.centers = centers;
    s.nodes = nodes;
    if (s.starField.length === 0) {
      s.starField = stars(STARS, Math.max(W, H) * 1.8);
    }

    const { selCat } = propsRef.current;
    if (selCat) {
      const c = centers.find((g) => g.category === selCat);
      if (c) {
        s.cam.tx = c.hx;
        s.cam.ty = c.hy;
        s.cam.tz = 2.5;
      }
    }
  }, [terms, categoryMeta]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && propsRef.current.selCat) zoomTo(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomTo]);

  useEffect(() => {
    initLayout();
    const obs = new ResizeObserver(() => initLayout());
    if (boxRef.current) obs.observe(boxRef.current);

    let id = 0;
    let prev = 0;

    function tick(ts: number) {
      const dt = prev ? (ts - prev) / 1000 : 1 / 60;
      prev = ts;

      const cv = cvRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      const s = st.current;
      const { dk, selCat } = propsRef.current;
      const { cam, W, H } = s;

      cam.x = lp(cam.x, cam.tx, LERP_F);
      cam.y = lp(cam.y, cam.ty, LERP_F);
      cam.z = lp(cam.z, cam.tz, LERP_F);

      for (const c of s.centers) {
        let dx = 0, dy = 0;
        for (const d of c.drift) {
          dx += d.ax * Math.sin(ts * d.fx + d.px);
          dy += d.ay * Math.sin(ts * d.fy + d.py);
        }
        c.cx = c.hx + dx;
        c.cy = c.hy + dy;
      }

      for (const nd of s.nodes) {
        const c = s.centers[nd.gi];
        nd.angle += nd.speed * dt;
        nd.x = c.cx + nd.orbit * Math.cos(nd.angle);
        nd.y = c.cy + nd.orbit * Math.sin(nd.angle);
      }

      ctx.save();
      ctx.scale(s.dpr, s.dpr);

      ctx.clearRect(0, 0, W, H);

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(cam.z, cam.z);
      ctx.translate(-cam.x, -cam.y);

      drawStars(ctx, s.starField, dk, ts);

      for (let i = 0; i < s.centers.length; i++) {
        const c = s.centers[i];
        const galA =
          selCat === null || selCat === c.category ? 1 : 0.12;
        const orbits = [
          ...new Set(
            s.nodes.filter((nd) => nd.gi === i).map((nd) => nd.orbit),
          ),
        ];
        for (const r of orbits) {
          drawOrbit(ctx, c.cx, c.cy, r, c.color, dk, galA);
        }
      }

      for (let i = 0; i < s.nodes.length; i++) {
        const nd = s.nodes[i];
        const c = s.centers[nd.gi];
        const galA =
          selCat === null || selCat === c.category ? 1 : 0.12;
        drawNode(ctx, nd, c.color, dk, i === s.hover, true, galA);
      }

      for (let i = 0; i < s.centers.length; i++) {
        const c = s.centers[i];
        const galA =
          selCat === null || selCat === c.category ? 1 : 0.12;
        drawCenter(ctx, c, dk, ts, i, galA);
      }

      ctx.restore();

      for (let i = 0; i < s.centers.length; i++) {
        const c = s.centers[i];
        const galA =
          selCat === null || selCat === c.category ? 1 : 0.12;
        if (galA < 0.3) continue;
        const [sx, sy] = w2s(c.cx, c.cy, cam, W, H);
        if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) continue;
        const fs = Math.max(9.5, 12 / Math.pow(cam.z, 0.35));
        ctx.font = `700 ${fs}px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillStyle = dk
          ? rgba(c.color, 0.85 * galA)
          : rgba(c.color, 0.75 * galA);
        ctx.fillText(c.label, sx, sy + 20 / Math.pow(cam.z, 0.45));
      }

      const lfs = Math.max(7.5, 10 / Math.pow(cam.z, 0.3));
      ctx.font = `500 ${lfs}px ${FONT}`;
      ctx.textAlign = "center";

      for (let i = 0; i < s.nodes.length; i++) {
        const nd = s.nodes[i];
        const c = s.centers[nd.gi];
        const galA =
          selCat === null || selCat === c.category ? 1 : 0.12;
        const isHov = i === s.hover;
        if (galA < 0.3 && !isHov) continue;

        const [sx, sy] = w2s(nd.x, nd.y, cam, W, H);
        if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

        let alpha: number;
        if (isHov) alpha = 1;
        else alpha = (0.25 + Math.min(0.65, (cam.z - 0.8) * 0.45)) * galA;

        ctx.fillStyle = dk
          ? `rgba(255,255,255,${alpha})`
          : `rgba(30,30,40,${alpha * 0.9})`;
        ctx.fillText(nd.term.title, sx, sy - (isHov ? 11 : 7));
      }

      if (s.hover >= 0) {
        const nd = s.nodes[s.hover];
        const c = s.centers[nd.gi];
        drawTooltip(ctx, nd, c.color, cam, W, H, dk);
      }

      ctx.restore();
      id = requestAnimationFrame(tick);
    }

    id = requestAnimationFrame(tick);

    const cv = cvRef.current!;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = st.current;
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const [wx, wy] = s2w(sx, sy, s.cam, s.W, s.H);
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const nz = Math.max(0.5, Math.min(5, s.cam.tz * factor));
      s.cam.tx = wx - (sx - s.W / 2) / nz;
      s.cam.ty = wy - (sy - s.H / 2) / nz;
      s.cam.tz = nz;
    };

    let touchDist = 0;
    let lastTouches: { x: number; y: number }[] = [];

    const onTouchStart = (e: TouchEvent) => {
      const ts = e.touches;
      lastTouches = Array.from(ts).map((t) => ({
        x: t.clientX,
        y: t.clientY,
      }));
      if (ts.length === 2) {
        const dx = ts[0].clientX - ts[1].clientX;
        const dy = ts[0].clientY - ts[1].clientY;
        touchDist = Math.sqrt(dx * dx + dy * dy);
      }
      st.current.moved = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = st.current;
      const ts = e.touches;
      if (ts.length === 1 && lastTouches.length >= 1) {
        const dx = ts[0].clientX - lastTouches[0].x;
        const dy = ts[0].clientY - lastTouches[0].y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) s.moved = true;
        s.cam.tx -= dx / s.cam.z;
        s.cam.ty -= dy / s.cam.z;
        s.cam.x = s.cam.tx;
        s.cam.y = s.cam.ty;
      }
      if (ts.length === 2) {
        const dx = ts[0].clientX - ts[1].clientX;
        const dy = ts[0].clientY - ts[1].clientY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (touchDist > 0) {
          s.cam.tz = Math.max(0.5, Math.min(5, s.cam.tz * (d / touchDist)));
        }
        touchDist = d;
        s.moved = true;
      }
      lastTouches = Array.from(ts).map((t) => ({
        x: t.clientX,
        y: t.clientY,
      }));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (st.current.moved || e.changedTouches.length !== 1) {
        lastTouches = [];
        touchDist = 0;
        return;
      }
      const s = st.current;
      const t = e.changedTouches[0];
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = t.clientX - rect.left;
      const sy = t.clientY - rect.top;
      const [wx, wy] = s2w(sx, sy, s.cam, s.W, s.H);

      const hr = 18 / s.cam.z;
      for (const nd of s.nodes) {
        if ((nd.x - wx) ** 2 + (nd.y - wy) ** 2 < hr * hr) {
          cbRef.current.onSelectTerm(nd.term);
          lastTouches = [];
          return;
        }
      }
      const cr = 28 / s.cam.z;
      for (const c of s.centers) {
        if ((c.cx - wx) ** 2 + (c.cy - wy) ** 2 < cr * cr) {
          zoomTo(propsRef.current.selCat === c.category ? null : c.category);
          lastTouches = [];
          return;
        }
      }
      if (s.cam.tz > 1.2) zoomTo(null);
      lastTouches = [];
    };

    cv.addEventListener("wheel", onWheel, { passive: false });
    cv.addEventListener("touchstart", onTouchStart, { passive: true });
    cv.addEventListener("touchmove", onTouchMove, { passive: false });
    cv.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(id);
      obs.disconnect();
      cv.removeEventListener("wheel", onWheel);
      cv.removeEventListener("touchstart", onTouchStart);
      cv.removeEventListener("touchmove", onTouchMove);
      cv.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zoomTo is stable via ref
  }, [initLayout]);

  /* ── Mouse handlers (React) ── */

  const onDown = useCallback((e: React.MouseEvent) => {
    const s = st.current;
    s.drag = true;
    s.dsx = e.clientX;
    s.dsy = e.clientY;
    s.moved = false;
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const s = st.current;
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (s.drag) {
      const dx = e.clientX - s.dsx;
      const dy = e.clientY - s.dsy;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) s.moved = true;
      s.cam.tx -= dx / s.cam.z;
      s.cam.ty -= dy / s.cam.z;
      s.cam.x = s.cam.tx;
      s.cam.y = s.cam.ty;
      s.dsx = e.clientX;
      s.dsy = e.clientY;
      return;
    }

    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const [wx, wy] = s2w(sx, sy, s.cam, s.W, s.H);
    const hr = 14 / s.cam.z;
    let hit = -1;
    for (let i = 0; i < s.nodes.length; i++) {
      const n = s.nodes[i];
      if ((n.x - wx) ** 2 + (n.y - wy) ** 2 < hr * hr) {
        hit = i;
        break;
      }
    }
    s.hover = hit;
    const cv = cvRef.current;
    if (cv)
      cv.style.cursor =
        hit >= 0 ? "pointer" : s.drag ? "grabbing" : "grab";
  }, []);

  const onUp = useCallback((e: React.MouseEvent) => {
    const s = st.current;
    s.drag = false;
    if (s.moved) return;

    if (s.hover >= 0) {
      cbRef.current.onSelectTerm(s.nodes[s.hover].term);
      return;
    }

    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const [wx, wy] = s2w(sx, sy, s.cam, s.W, s.H);
    const cr = 22 / s.cam.z;
    for (const c of s.centers) {
      if ((c.cx - wx) ** 2 + (c.cy - wy) ** 2 < cr * cr) {
        zoomTo(propsRef.current.selCat === c.category ? null : c.category);
        return;
      }
    }
    if (s.cam.tz > 1.2) zoomTo(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zoomTo is stable via ref
  }, []);

  const onLeave = useCallback(() => {
    st.current.hover = -1;
    st.current.drag = false;
  }, []);

  return (
    <div ref={boxRef} className="galaxy-container">
      <canvas
        ref={cvRef}
        className="galaxy-canvas"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onLeave}
      />
    </div>
  );
}
