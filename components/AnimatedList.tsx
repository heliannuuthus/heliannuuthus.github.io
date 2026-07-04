"use client";

import { Children } from "react";
import {
  motion,
  useReducedMotion,
  type Variants
} from "motion/react";
import { cn } from "@/lib/cn";

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  itemGap?: number;
  duration?: number;
  enterFrom?: "top" | "bottom" | "left" | "right";
  animationType?: "slide" | "fade" | "scale" | "blur";
  hoverEffect?: "none" | "scale" | "lift";
}

const offsets = {
  top: { x: 0, y: -18 },
  bottom: { x: 0, y: 20 },
  left: { x: -26, y: 0 },
  right: { x: 26, y: 0 }
};

export default function AnimatedList({
  children,
  className,
  itemClassName,
  itemGap = 12,
  duration = 0.42,
  enterFrom = "bottom",
  animationType = "slide",
  hoverEffect = "lift"
}: AnimatedListProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  if (reduceMotion) {
    return (
      <div className={cn("rb-animated-list", className)} style={{ gap: itemGap }}>
        {items.map((child, index) => (
          <div key={index} className={cn("rb-animated-list-item", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  const initialOffset = offsets[enterFrom];
  const initial = {
    opacity: animationType === "scale" ? 0.84 : 0,
    x: animationType === "slide" || animationType === "blur" ? initialOffset.x : 0,
    y: animationType === "slide" || animationType === "blur" ? initialOffset.y : 0,
    scale: animationType === "scale" ? 0.96 : 1,
    filter: animationType === "blur" ? "blur(10px)" : "blur(0px)"
  };

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)"
    }
  };

  return (
    <motion.div
      className={cn("rb-animated-list", className)}
      style={{ gap: itemGap }}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.055,
            delayChildren: 0.04
          }
        }
      }}
    >
      {items.map((child, index) => (
        <motion.div
          key={index}
          className={cn(
            "rb-animated-list-item",
            hoverEffect !== "none" && "rb-animated-list-item--interactive",
            hoverEffect === "scale" && "rb-animated-list-item--scale",
            hoverEffect === "lift" && "rb-animated-list-item--lift",
            itemClassName
          )}
          variants={variants}
          transition={{
            duration,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={
            hoverEffect === "scale"
              ? { scale: 1.012 }
              : hoverEffect === "lift"
                ? { y: -2 }
                : undefined
          }
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
