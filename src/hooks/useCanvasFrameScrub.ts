"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function padFrame(n: number): string {
  return String(n).padStart(3, "0");
}

interface UseCanvasFrameScrubOptions {
  /** Total number of frames to load */
  totalFrames: number;
  /** Path prefix before the padded frame number, e.g. "/frames/ezgif-frame-" */
  framePrefix: string;
  /** File extension including dot, default ".jpg" */
  ext?: string;
  /** GSAP scrub value, default 0.5 */
  scrub?: number;
  /** Fraction of scroll at which all frames should be reached (default 1 = full scroll). Use 0.8 to finish frames at 80% scroll. */
  progressEnd?: number;
}

export function useCanvasFrameScrub({
  totalFrames,
  framePrefix,
  ext = ".jpg",
  scrub = 0.5,
  progressEnd = 1,
}: UseCanvasFrameScrubOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  /* ── preload frames ── */
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${framePrefix}${padFrame(i + 1)}${ext}`;
      img.onload = () => {
        count++;
        if (count >= totalFrames) setLoaded(true);
      };
      img.onerror = () => {
        count++;
        if (count >= totalFrames) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [totalFrames, framePrefix, ext]);

  /* ── draw frame on canvas ── */
  const drawFrame = useCallback(
    (index: number) => {
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
      currentFrameRef.current = index;
    },
    [],
  );

  /* ── GSAP ScrollTrigger for canvas frame scrub ── */
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    drawFrame(0);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub,
      onUpdate: (self) => {
        const frameProgress = Math.min(self.progress / progressEnd, 1);
        const frame = Math.round(frameProgress * (totalFrames - 1));
        drawFrame(Math.min(frame, totalFrames - 1));
      },
    });

    return () => st.kill();
  }, [loaded, drawFrame, scrub, progressEnd, totalFrames]);

  /* ── resize handler ── */
  useEffect(() => {
    if (!loaded) return;
    const onResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loaded, drawFrame]);

  return { containerRef, canvasRef, loaded };
}
