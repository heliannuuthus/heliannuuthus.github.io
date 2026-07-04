"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

interface CardTransform {
  blur: number;
  rotation: number;
  scale: number;
  translateY: number;
}

function calculateProgress(scrollTop: number, start: number, end: number) {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / Math.max(1, end - start);
}

function parsePosition(value: string | number, viewportHeight: number) {
  if (typeof value === "string" && value.includes("%")) {
    return (parseFloat(value) / 100) * viewportHeight;
  }

  return typeof value === "number" ? value : parseFloat(value);
}

function elementTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function cardDocumentTop(root: HTMLElement, element: HTMLElement) {
  return elementTop(root) + element.offsetTop;
}

export function ScrollStack({
  children,
  className,
  itemDistance = 34,
  itemScale = 0.018,
  itemStackDistance = 22,
  stackPosition = "68%",
  scaleEndPosition = "46%",
  baseScale = 0.9,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete
}: ScrollStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTransformsRef = useRef(new Map<number, CardTransform>());
  const stackCompletedRef = useRef(false);

  const updateCardTransforms = useCallback(() => {
    const root = rootRef.current;
    if (!root || cardsRef.current.length === 0) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const stackPositionPx = parsePosition(stackPosition, viewportHeight);
    const scaleEndPositionPx = parsePosition(scaleEndPosition, viewportHeight);
    const endElement = root.querySelector(".rb-scroll-stack-end") as HTMLElement | null;
    const endElementTop = endElement ? cardDocumentTop(root, endElement) : elementTop(root) + root.offsetHeight;
    let topCardIndex = 0;

    cardsRef.current.forEach((card, index) => {
      const triggerStart = cardDocumentTop(root, card) - stackPositionPx - itemStackDistance * index;
      if (scrollTop >= triggerStart) topCardIndex = index;
    });

    cardsRef.current.forEach((card, index) => {
      const cardTop = cardDocumentTop(root, card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinEnd = endElementTop - viewportHeight * 0.55;
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;
      const depth = Math.max(0, topCardIndex - index);
      const blur = blurAmount ? depth * blurAmount : 0;
      let translateY = 0;

      if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      const nextTransform: CardTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };
      const lastTransform = lastTransformsRef.current.get(index);
      const changed =
        !lastTransform ||
        Math.abs(lastTransform.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - nextTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - nextTransform.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`;
        card.style.filter = nextTransform.blur ? `blur(${nextTransform.blur}px)` : "";
        lastTransformsRef.current.set(index, nextTransform);
      }

      if (index === cardsRef.current.length - 1) {
        const inStack = scrollTop >= triggerStart && scrollTop <= pinEnd;
        if (inStack && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inStack && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    baseScale,
    blurAmount,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    scaleEndPosition,
    stackPosition
  ]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    cardsRef.current = Array.from(root.querySelectorAll(".rb-scroll-stack-card")) as HTMLElement[];
    cardsRef.current.forEach((card, index) => {
      card.style.marginBottom = index < cardsRef.current.length - 1 ? `${itemDistance}px` : "0";
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
    });

    const requestUpdate = () => {
      if (animationFrameRef.current) return;
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        updateCardTransforms();
      });
    };

    updateCardTransforms();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      lastTransformsRef.current.clear();
      cardsRef.current = [];
      stackCompletedRef.current = false;
    };
  }, [itemDistance, updateCardTransforms]);

  return (
    <div ref={rootRef} className={cn("rb-scroll-stack", className)}>
      <div className="rb-scroll-stack-inner">
        {children}
        <div className="rb-scroll-stack-end" aria-hidden />
      </div>
    </div>
  );
}

export function ScrollStackItem({ children, className, index }: ScrollStackItemProps) {
  return (
    <div
      className={cn("rb-scroll-stack-card", className)}
      style={{ "--rb-stack-z": typeof index === "number" ? index + 1 : 1 } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
