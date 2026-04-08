"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import FloatingPanels from "./FloatingPanels";
import HUD from "./HUD";

const TOTAL_FRAMES = 151;
const FRAME_PREFIX = "/frames/ezgif-frame-";

function padFrame(n: number): string {
  return String(n).padStart(3, "0");
}

export default function SpaceScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { contentX, contentY } = useMouseParallax(25);

  /* ── scroll tracking ── */
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── frame index: map [0, 0.80] → [0, 150] ── */
  const frameIndex = useTransform(
    smoothProgress,
    [0, 0.8],
    [0, TOTAL_FRAMES - 1],
  );

  /* ── dark overlay: 80% → 0% opacity over 0-15% scroll ── */
  const overlayOpacity = useTransform(smoothProgress, [0, 0.15], [0.8, 0]);

  /* ── preload frames ── */
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_PREFIX}${padFrame(i + 1)}.jpg`;
      img.onload = () => {
        count++;
        if (count >= TOTAL_FRAMES) setLoaded(true);
      };
      img.onerror = () => {
        count++;
        if (count >= TOTAL_FRAMES) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  /* ── draw frame on canvas ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[Math.round(index)];
    if (!img || !img.complete) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight,
    );
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  /* ── subscribe to frame changes ── */
  useMotionValueEvent(frameIndex, "change", (v) => {
    drawFrame(Math.min(Math.max(Math.round(v), 0), TOTAL_FRAMES - 1));
  });

  /* ── initial draw + resize ── */
  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    const onResize = () => drawFrame(Math.round(frameIndex.get()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loaded, drawFrame, frameIndex]);

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
                Loading Lunar Sequence
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
