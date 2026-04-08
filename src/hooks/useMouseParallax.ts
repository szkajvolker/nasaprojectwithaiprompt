"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMouseParallax(strength: number = 25) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const contentX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const contentY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = ((e.clientX - centerX) / centerX) * -strength;
      const offsetY = ((e.clientY - centerY) / centerY) * -strength;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, strength]);

  return { contentX, contentY };
}
