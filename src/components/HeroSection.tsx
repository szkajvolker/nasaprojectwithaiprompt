"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowUp } from "lucide-react";
import ApodCard from "./ApodCard";
import { useMouseParallax } from "@/hooks/useMouseParallax";

export interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  media_type: string;
  copyright?: string;
}

export default function HeroSection() {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const { contentX, contentY } = useMouseParallax(15);

  useEffect(() => {
    fetch("/api/apod", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApod(data))
      .catch(() => setApod(null))
      .finally(() => setLoading(false));
  }, []);

  const fetchRandomApod = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/apod?random=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: ApodData = await res.json();
      setApod(data);
      setKey((k) => k + 1);
    } catch (err) {
      console.error("APOD fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const returnToOrbit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background: radial gradient + noise */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0c1445_0%,#020617_60%,#000000_100%)]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Content container with parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32"
        style={{ x: contentX, y: contentY }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-mono tracking-[0.4em] text-indigo-400/70 uppercase mb-4">
              Mission Data Feed
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              Cosmic View
            </h2>
            <p className="text-lg text-white/40 font-light">
              Astronomy Picture of the Day
            </p>
            <div className="w-24 h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent mx-auto mt-6" />
          </motion.div>
        </div>

        {/* APOD Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          {apod && (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ApodCard apod={apod} />
            </motion.div>
          )}
        </AnimatePresence>

        {!apod && !loading && (
          <div className="text-center py-20">
            <p className="text-white/30 font-mono text-sm">
              No data received from NASA API
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <motion.button
            onClick={fetchRandomApod}
            disabled={loading}
            className="glass-panel rounded-xl px-8 py-4 flex items-center gap-3 text-white/80 hover:text-white border border-indigo-500/20 hover:border-indigo-500/40 transition-colors disabled:opacity-50 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={
                loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}
              }
            >
              <RefreshCw size={18} />
            </motion.div>
            <span className="text-sm font-mono tracking-wider uppercase">
              {loading ? "Initiating Jump..." : "Randomize Coordinates"}
            </span>
          </motion.button>

          <motion.button
            onClick={returnToOrbit}
            className="glass-panel rounded-xl px-8 py-4 flex items-center gap-3 text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowUp size={18} />
            <span className="text-sm font-mono tracking-wider uppercase">
              Return to Orbit
            </span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
