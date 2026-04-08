"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useCanvasFrameScrub } from "@/hooks/useCanvasFrameScrub";
import FloatingPanels from "./FloatingPanels";
import HUD from "./HUD";
import { LOADING_LUNAR } from "@/constants/data";

export default function SpaceScrollHero() {
  const { containerRef, canvasRef, loaded } = useCanvasFrameScrub({
    totalFrames: 151,
    framePrefix: "/frames/ezgif-frame-",
    progressEnd: 0.8,
  });

  const { contentX, contentY } = useMouseParallax(25);

  /* ── Framer Motion scroll for FloatingPanels & HUD ── */
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── dark overlay: 80% → 0% opacity over 0-15% scroll ── */
  const overlayOpacity = useTransform(smoothProgress, [0, 0.15], [0.9, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "500vh" }}
    >
      {/* sticky viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        {/* canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* dark overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        <FloatingPanels
          smoothProgress={smoothProgress}
          contentX={contentX}
          contentY={contentY}
        />

        <HUD
          smoothProgress={smoothProgress}
          contentX={contentX}
          contentY={contentY}
        />

        {/* Loading screen */}
        {!loaded && (
          <div className="absolute inset-0 bg-deep-space flex items-center justify-center z-50">
            <div className="text-center">
              <motion.div
                className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xs font-mono text-white/40 tracking-[0.3em] uppercase">
                {LOADING_LUNAR}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
