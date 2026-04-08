"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import type { MotionValue } from "framer-motion";

function PulsingBar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-0.75 h-3 bg-white/90 rounded-sm"
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ duration: delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

interface HUDProps {
  smoothProgress: MotionValue<number>;
  contentX: MotionValue<number>;
  contentY: MotionValue<number>;
}

export default function HUD({ smoothProgress, contentX, contentY }: HUDProps) {
  const coordRef = useRef<HTMLSpanElement>(null);
  const [telemetryStatus, setTelemetryStatus] = useState<
    "offline" | "syncing" | "active"
  >("offline");

  const hudOpacity = useTransform(
    smoothProgress,
    [0, 0.93, 0.95],
    [0.65, 1, 0],
  );

  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (v < 0.05) setTelemetryStatus("offline");
    else if (v < 0.15) setTelemetryStatus("syncing");
    else setTelemetryStatus("active");
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!coordRef.current) return;
      const lonDeg = ((e.clientX / window.innerWidth) * 360 - 180).toFixed(0);
      const latDeg = ((e.clientY / window.innerHeight) * 180 - 90).toFixed(0);
      const lonMin = Math.abs(Math.floor(Math.random() * 60));
      const lonSec = Math.abs(Math.floor(Math.random() * 60));
      const latMin = Math.abs(Math.floor(Math.random() * 60));
      const latSec = Math.abs(Math.floor(Math.random() * 60));
      const lonDir = Number(lonDeg) >= 0 ? "E" : "W";
      const latDir = Number(latDeg) >= 0 ? "N" : "S";
      coordRef.current.innerText = `${Math.abs(Number(lonDeg))}°${lonMin}'${lonSec}"${lonDir} ${Math.abs(Number(latDeg))}°${latMin}'${latSec}"${latDir}`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20"
      style={{ opacity: hudOpacity }}
    >
      {/* ── Mobile: top group (stacked) ── */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 md:hidden">
        <motion.div style={{ x: contentX, y: contentY }} className="bg-deep-space rounded-full p-2 w-fit">
          <span className="text-xs font-mono text-white/70 tracking-widest">
            REF: NASA-API-V2.04
          </span>
        </motion.div>
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="flex items-center gap-2 bg-deep-space rounded-full p-2 w-fit"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            SIGNAL: NOMINAL
          </span>
          <div className="flex items-end gap-0.5">
            <div className="w-0.75 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-0.75 h-2 bg-white/70 rounded-sm" />
            <div className="w-0.75 h-2.5 bg-white/80 rounded-sm" />
            <PulsingBar delay={0.8} />
            <PulsingBar delay={1.2} />
          </div>
        </motion.div>
      </div>

      {/* ── Mobile: bottom group (stacked) ── */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 md:hidden">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="flex items-center gap-2 bg-deep-space rounded-full p-2 w-fit"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            TELEMETRY:{" "}
          </span>
          <span
            className="text-xs font-mono font-bold tracking-widest transition-all duration-500"
            style={{
              color:
                telemetryStatus === "offline"
                  ? "#fb923c"
                  : telemetryStatus === "syncing"
                    ? "#facc15"
                    : "#4ade80",
              textShadow:
                telemetryStatus === "offline"
                  ? "0 0 6px #fb923c, 0 0 12px #ea580c"
                  : telemetryStatus === "syncing"
                    ? "0 0 6px #facc15, 0 0 12px #ca8a04"
                    : "0 0 6px #4ade80, 0 0 12px #22c55e, 0 0 24px #16a34a",
            }}
          >
            {telemetryStatus === "offline"
              ? "OFFLINE"
              : telemetryStatus === "syncing"
                ? "SYNCING"
                : "ACTIVE"}
          </span>
          <svg width="8" height="8" viewBox="0 0 8 8" className="ml-1">
            <motion.circle
              cx="4"
              cy="4"
              r="3"
              fill={
                telemetryStatus === "offline"
                  ? "#fb923c"
                  : telemetryStatus === "syncing"
                    ? "#facc15"
                    : "#4ade80"
              }
              animate={
                telemetryStatus === "offline"
                  ? { opacity: [0.6, 0.2, 0.6] }
                  : telemetryStatus === "syncing"
                    ? { opacity: [1, 0.4, 1], r: ["3", "2", "3"] }
                    : { opacity: [1, 0.3, 1], r: ["3", "2.5", "3"] }
              }
              transition={{
                duration: telemetryStatus === "offline" ? 2 : 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="bg-deep-space rounded-full p-2 w-fit"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            COORD:{" "}
            <span ref={coordRef} className="text-white/60">
              0°0&apos;0&quot;E 0°0&apos;0&quot;N
            </span>
          </span>
        </motion.div>
      </div>

      {/* ── Desktop: absolute corners ── */}
      {/* Top Left */}
      <div className="hidden md:block absolute top-6 left-6">
        <motion.div style={{ x: contentX, y: contentY }} className="bg-deep-space rounded-full p-2">
          <span className="text-xs font-mono text-white/70 tracking-widest">
            REF: NASA-API-V2.04
          </span>
        </motion.div>
      </div>

      {/* Top Right — Signal Strength */}
      <div className="hidden md:block absolute top-6 right-6">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="flex items-center gap-2 bg-deep-space rounded-full p-2"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            SIGNAL STRENGTH: NOMINAL
          </span>
          <div className="flex items-end gap-0.5">
            <div className="w-0.75 h-1.5 bg-white/60 rounded-sm" />
            <div className="w-0.75 h-2 bg-white/70 rounded-sm" />
            <div className="w-0.75 h-2.5 bg-white/80 rounded-sm" />
            <PulsingBar delay={0.8} />
            <PulsingBar delay={1.2} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Left — Telemetry */}
      <div className="hidden md:block absolute bottom-6 left-6">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="flex items-center gap-2 bg-deep-space rounded-full p-2"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            TELEMETRY STREAM:{" "}
          </span>
          <span
            className="text-xs font-mono font-bold tracking-widest transition-all duration-500"
            style={{
              color:
                telemetryStatus === "offline"
                  ? "#fb923c"
                  : telemetryStatus === "syncing"
                    ? "#facc15"
                    : "#4ade80",
              textShadow:
                telemetryStatus === "offline"
                  ? "0 0 6px #fb923c, 0 0 12px #ea580c"
                  : telemetryStatus === "syncing"
                    ? "0 0 6px #facc15, 0 0 12px #ca8a04"
                    : "0 0 6px #4ade80, 0 0 12px #22c55e, 0 0 24px #16a34a",
            }}
          >
            {telemetryStatus === "offline"
              ? "OFFLINE"
              : telemetryStatus === "syncing"
                ? "SYNCING"
                : "ACTIVE"}
          </span>
          <svg width="8" height="8" viewBox="0 0 8 8" className="ml-1">
            <motion.circle
              cx="4"
              cy="4"
              r="3"
              fill={
                telemetryStatus === "offline"
                  ? "#fb923c"
                  : telemetryStatus === "syncing"
                    ? "#facc15"
                    : "#4ade80"
              }
              animate={
                telemetryStatus === "offline"
                  ? { opacity: [0.6, 0.2, 0.6] }
                  : telemetryStatus === "syncing"
                    ? { opacity: [1, 0.4, 1], r: ["3", "2", "3"] }
                    : { opacity: [1, 0.3, 1], r: ["3", "2.5", "3"] }
              }
              transition={{
                duration: telemetryStatus === "offline" ? 2 : 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Bottom Right — Coordinates */}
      <div className="hidden md:block absolute bottom-6 right-6">
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="bg-deep-space rounded-full p-2"
        >
          <span className="text-xs font-mono text-white/70 tracking-widest">
            COORD:{" "}
            <span ref={coordRef} className="text-white/60">
              0°0&apos;0&quot;E 0°0&apos;0&quot;N
            </span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
