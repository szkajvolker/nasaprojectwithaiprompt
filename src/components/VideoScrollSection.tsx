"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useCanvasFrameScrub } from "@/hooks/useCanvasFrameScrub";
import {
  VIDEO_PANEL1_TITLE,
  VIDEO_PANEL1_SUBTITLE,
  VIDEO_PANEL2_TITLE,
  VIDEO_PANEL2_SUBTITLE,
  VIDEO_PANEL3_TITLE,
  VIDEO_PANEL3_SUBTITLE,
  VIDEO_PANEL4_TITLE,
  VIDEO_PANEL4_SUBTITLE,
  LOADING_FOOTAGE,
} from "@/constants/data";

export default function VideoScrollSection() {
  const { containerRef, canvasRef, loaded } = useCanvasFrameScrub({
    totalFrames: 90,
    framePrefix: "/frames/imageframes/ezgif-frame-",
  });

  const { contentX, contentY } = useMouseParallax(20);

  /* ── Framer Motion scroll for floating panels ── */
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── floating text transforms ── */
  const p1Opacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.2, 0.25],
    [0, 1, 1, 0],
  );
  const p1Scale = useTransform(
    smoothProgress,
    [0, 0.08, 0.18, 0.25],
    [0.9, 1, 1, 1.05],
  );

  const p2Opacity = useTransform(
    smoothProgress,
    [0.25, 0.32, 0.5, 0.55],
    [0, 1, 1, 0],
  );
  const p2X = useTransform(smoothProgress, [0.25, 0.34], [60, 0]);

  const p3Opacity = useTransform(
    smoothProgress,
    [0.55, 0.62, 0.8, 0.85],
    [0, 1, 1, 0],
  );
  const p3X = useTransform(smoothProgress, [0.55, 0.64], [-60, 0]);

  const p4Opacity = useTransform(
    smoothProgress,
    [0.8, 0.85, 0.92, 0.97],
    [0, 1, 1, 0],
  );
  const p4Y = useTransform(smoothProgress, [0.8, 0.88], [50, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      {/* sticky viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        {/* canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ════════ FLOATING TEXT PANELS ════════ */}

        {/* Panel 1: Descent into Darkness — centered */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{
            opacity: p1Opacity,
            scale: p1Scale,
            x: contentX,
            y: contentY,
          }}
        >
          <div className="glass-panel rounded-2xl px-10 py-8 text-center max-w-xl border border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
              {VIDEO_PANEL1_TITLE}
            </h2>
            <p className="text-xs font-mono tracking-[0.3em] text-indigo-300/80 uppercase mb-4">
              {VIDEO_PANEL1_SUBTITLE}
            </p>
            <div className="w-16 h-px bg-linear-to-r from-transparent via-indigo-400 to-transparent mx-auto" />
          </div>
        </motion.div>

        {/* Panel 2: Gravity's Embrace — mid-right */}
        <motion.div
          className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 pointer-events-none z-10"
          style={{ opacity: p2Opacity, x: p2X }}
        >
          <motion.div style={{ x: contentX, y: contentY }}>
            <div className="glass-panel rounded-xl px-8 py-6 max-w-xs border border-indigo-500/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {VIDEO_PANEL2_TITLE}
              </h2>
              <p className="text-xs font-mono tracking-[0.25em] text-indigo-400 uppercase">
                {VIDEO_PANEL2_SUBTITLE}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Panel 3: Tidal Lock — mid-left */}
        <motion.div
          className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 pointer-events-none z-10"
          style={{ opacity: p3Opacity, x: p3X }}
        >
          <motion.div style={{ x: contentX, y: contentY }}>
            <div className="glass-panel rounded-xl px-8 py-6 max-w-xs border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {VIDEO_PANEL3_TITLE}
              </h2>
              <p className="text-xs font-mono tracking-[0.25em] text-indigo-400/70 uppercase">
                {VIDEO_PANEL3_SUBTITLE}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Panel 4: One Small Step — bottom center */}
        <motion.div
          className="absolute bottom-20 inset-x-0 flex justify-center pointer-events-none z-10"
          style={{ opacity: p4Opacity, y: p4Y }}
        >
          <motion.div style={{ x: contentX, y: contentY }}>
            <div className="glass-panel rounded-xl px-8 py-6 max-w-md border border-indigo-500/15 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {VIDEO_PANEL4_TITLE}
              </h2>
              <p className="text-xs font-mono tracking-[0.25em] text-indigo-300/60 uppercase">
                {VIDEO_PANEL4_SUBTITLE}
              </p>
            </div>
          </motion.div>
        </motion.div>

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
                {LOADING_FOOTAGE}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
