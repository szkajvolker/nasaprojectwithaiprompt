"use client";

import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface FloatingPanelsProps {
  smoothProgress: MotionValue<number>;
  contentX: MotionValue<number>;
  contentY: MotionValue<number>;
}

export default function FloatingPanels({
  smoothProgress,
  contentX,
  contentY,
}: FloatingPanelsProps) {
  // Panel 1: 0%-15%  "Voyage To The Lunar Surface"
  const p1Opacity = useTransform(
    smoothProgress,
    [0, 0.02, 0.1, 0.15],
    [0, 1, 1, 0],
  );
  const p1Scale = useTransform(
    smoothProgress,
    [0, 0.05, 0.12, 0.15],
    [0.85, 1, 1, 1.1],
  );

  // Panel 2: 15%-45%  "Lunar Mechanics"
  const p2Opacity = useTransform(
    smoothProgress,
    [0.15, 0.2, 0.4, 0.45],
    [0, 1, 1, 0],
  );
  const p2X = useTransform(smoothProgress, [0.15, 0.22], [80, 0]);

  // Panel 3: 35%-70%  "Silence of the Vacuum"
  const p3Opacity = useTransform(
    smoothProgress,
    [0.35, 0.4, 0.65, 0.7],
    [0, 1, 1, 0],
  );
  const p3X = useTransform(smoothProgress, [0.35, 0.42], [-80, 0]);

  // Panel 4: 55%-70%  "Tracking Lunar Phases"
  const p4Opacity = useTransform(
    smoothProgress,
    [0.55, 0.6, 0.65, 0.7],
    [0, 1, 1, 0],
  );
  const p4Y = useTransform(smoothProgress, [0.55, 0.62], [60, 0]);

  // Panel 5: 72%-86%  "The Scale of the Void"
  const p5Opacity = useTransform(
    smoothProgress,
    [0.72, 0.76, 0.82, 0.86],
    [0, 1, 1, 0],
  );
  const p5Y = useTransform(smoothProgress, [0.72, 0.78, 0.86], [60, 0, -200]);

  return (
    <>
      {/* Panel 1: Voyage */}
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
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-3 leading-tight">
            Voyage To The Lunar Surface
          </h1>
          <p className="text-xs font-mono tracking-[0.3em] text-indigo-300/80 uppercase mb-6">
            The Artemis Archive // Powered by NASA
          </p>
          <div className="w-16 h-px bg-linear-to-r from-transparent via-indigo-400 to-transparent mx-auto mb-4" />
          <p className="text-sm tracking-widest text-white/50 uppercase font-mono">
            Unveiling The Dark Side
          </p>
        </div>
      </motion.div>

      {/* Panel 2: Lunar Mechanics — mid-right */}
      <motion.div
        className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 pointer-events-none z-10"
        style={{ opacity: p2Opacity, x: p2X }}
      >
        <motion.div style={{ x: contentX, y: contentY }}>
          <div className="glass-panel rounded-xl px-8 py-6 max-w-xs border border-indigo-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Lunar Mechanics
            </h2>
            <p className="text-xs font-mono tracking-[0.25em] text-indigo-400 uppercase">
              In Motion
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel 3: Silence of the Vacuum — mid-left */}
      <motion.div
        className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 pointer-events-none z-10"
        style={{ opacity: p3Opacity, x: p3X }}
      >
        <motion.div style={{ x: contentX, y: contentY }}>
          <div className="glass-panel rounded-xl px-8 py-6 max-w-xs border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Silence of the Vacuum
            </h2>
            <p className="text-xs font-mono tracking-[0.25em] text-indigo-400/70 uppercase">
              151 Frames of Lunar Rotation
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel 4: Tracking Lunar Phases — bottom-right */}
      <motion.div
        className="absolute bottom-24 right-8 md:right-16 pointer-events-none z-10"
        style={{ opacity: p4Opacity, y: p4Y }}
      >
        <motion.div style={{ x: contentX, y: contentY }}>
          <div className="glass-panel rounded-xl px-8 py-6 max-w-xs border border-indigo-500/15">
            <h2 className="text-2xl font-bold text-white mb-2">
              Tracking Lunar Phases
            </h2>
            <p className="text-xs font-mono tracking-[0.25em] text-indigo-300/60 uppercase">
              Beyond the Exosphere
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Panel 5: The Scale of the Void — centered paragraph */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: p5Opacity, y: p5Y }}
      >
        <motion.div style={{ x: contentX, y: contentY }}>
          <div className="glass-panel rounded-2xl px-10 py-8 max-w-2xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              The Scale of the Void
            </h2>
            <div className="w-20 h-px bg-linear-to-r from-transparent via-indigo-400 to-transparent mx-auto mb-5" />
            <p className="text-sm md:text-base leading-relaxed text-white/70 text-center">
              The average distance between Earth and the Moon is 384,400 km —
              roughly 30 Earths lined side by side. Light itself takes 1.28
              seconds to cross this divide. Beyond our Moon, the nearest star
              system, Alpha Centauri, sits 4.37 light-years away — over 40
              trillion kilometers of interstellar vacuum. If the Earth were a
              basketball, the Moon would be a tennis ball placed 7.4 meters
              away, and the nearest star would be over 8,700 km distant. Space
              is not merely vast; it is incomprehensibly, achingly empty.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
