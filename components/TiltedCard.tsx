"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import type { SpringOptions } from "motion/react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  children,
  className,
  containerClassName,
  rotateAmplitude = 5,
  scaleOnHover = 1.012
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const [lastY, setLastY] = useState(0);
  const glareX = useMotionValue("50%");
  const glareY = useMotionValue("50%");
  const glareOpacity = useSpring(0);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), rgba(161,161,170,0.08) 24%, transparent 50%)`;
  const glareRotate = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  function handleMouse(event: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    glareX.set(`${event.clientX - rect.left}px`);
    glareY.set(`${event.clientY - rect.top}px`);
    glareRotate.set(-(offsetY - lastY) * 0.4);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    glareOpacity.set(1);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
    glareRotate.set(0);
  }

  return (
    <figure
      ref={ref}
      className={cn("tilted-card-figure", containerClassName)}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn("tilted-card-inner", className)}
        style={{
          rotateX,
          rotateY,
          scale
        }}
      >
        {children}
        <motion.div
          aria-hidden
          className="tilted-card-glare"
          style={{
            opacity: glareOpacity,
            rotate: glareRotate,
            background: glareBackground
          }}
        />
      </motion.div>
    </figure>
  );
}
