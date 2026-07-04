"use client";

import { Children, createContext, useContext, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue
} from "motion/react";
import { cn } from "@/lib/cn";

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
}

interface ScrollStackItemProps {
  children: React.ReactNode;
  className?: string;
  index: number;
}

interface ScrollStackContextValue {
  progress: MotionValue<number>;
  total: number;
}

const ScrollStackContext = createContext<ScrollStackContextValue | null>(null);

export function ScrollStack({ children, className }: ScrollStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const total = Math.max(1, Children.count(children));
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 34%"]
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35
  });

  const value = useMemo(
    () => ({
      progress,
      total
    }),
    [progress, total]
  );

  return (
    <ScrollStackContext.Provider value={value}>
      <div
        ref={ref}
        className={cn("rb-scroll-stack", className)}
        style={{ "--rb-stack-count": total } as React.CSSProperties}
      >
        <div className="rb-scroll-stack-stage">{children}</div>
      </div>
    </ScrollStackContext.Provider>
  );
}

export function ScrollStackItem({
  children,
  className,
  index
}: ScrollStackItemProps) {
  const context = useContext(ScrollStackContext);
  const reduceMotion = useReducedMotion();

  if (!context || reduceMotion) {
    return (
      <div
        className={cn("rb-scroll-stack-item", className)}
        style={{ "--rb-stack-z": index + 1 } as React.CSSProperties}
      >
        {children}
      </div>
    );
  }

  return (
    <AnimatedScrollStackItem context={context} index={index} className={className}>
      {children}
    </AnimatedScrollStackItem>
  );
}

function AnimatedScrollStackItem({
  children,
  className,
  context,
  index
}: ScrollStackItemProps & { context: ScrollStackContextValue }) {
  const total = Math.max(context.total, 1);
  const segment = 1 / total;
  const start = Math.max(0, index * segment - 0.05);
  const mid = Math.min(1, index * segment + segment * 0.42);
  const end = Math.min(1, index * segment + segment * 1.08);
  const stackedY = index * 14;
  const stackedScale = Math.max(0.92, 1 - index * 0.012);
  const initialY = index === 0 ? stackedY : 86;
  const initialScale = index === 0 ? 1 : 0.965;
  const initialOpacity = index === 0 ? 1 : 0;
  const initialBlur = index === 0 ? 0 : 10;

  const y = useTransform(context.progress, [start, mid, end], [initialY, stackedY, stackedY]);
  const scale = useTransform(context.progress, [start, mid, end], [initialScale, 1, stackedScale]);
  const opacity = useTransform(context.progress, [start, mid], [initialOpacity, 1]);
  const blur = useTransform(context.progress, [start, mid], [initialBlur, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.div
      className={cn("rb-scroll-stack-item", className)}
      initial={false}
      style={
        {
          "--rb-stack-z": index + 1,
          y,
          scale,
          opacity,
          filter
        } as MotionStyle
      }
    >
      {children}
    </motion.div>
  );
}
