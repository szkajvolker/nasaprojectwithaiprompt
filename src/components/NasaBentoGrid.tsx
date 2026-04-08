"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ActionButtons from "./ActionButtons";
import { BENTO_LABEL, BENTO_TITLE } from "@/constants/data";

interface NasaImage {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface ApiResponse {
  query: string;
  results: NasaImage[];
}

/* ── bento card grid positions (desktop 4-col, 3-row) ── */
const GRID_CLASSES = [
  "col-span-2 row-span-2", // 0 — large hero
  "col-span-2 row-span-1", // 1 — wide top-right
  "col-span-1 row-span-1", // 2 — small
  "col-span-1 row-span-1", // 3 — small
  "col-span-2 row-span-1", // 4 — wide bottom-left
  "col-span-2 row-span-1", // 5 — wide bottom-right
];

/* cards with image backgrounds (indices) */
const IMAGE_BG = new Set([0, 1, 5]);

export default function NasaBentoGrid() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nasa-images");
      if (!res.ok) throw new Error("fetch failed");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <section className="relative w-full px-4 md:px-8 lg:px-16 py-24">
      {/* section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs font-mono tracking-[0.4em] text-indigo-400/70 uppercase mb-3">
          {BENTO_LABEL}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          {BENTO_TITLE}
        </h2>
        {data?.query && (
          <p className="mt-3 text-sm font-mono text-white/30 tracking-wider">
            Showing results for &ldquo;{data.query}&rdquo;
          </p>
        )}
      </motion.div>

      {/* bento grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className={`${GRID_CLASSES[i]} rounded-2xl bg-white/5 animate-pulse`}
              />
            ))
          : data?.results.map((item, i) => (
              <BentoCard
                key={`${data.query}-${i}`}
                item={item}
                index={i}
                hasImageBg={IMAGE_BG.has(i)}
              />
            ))}
      </div>

      {/* shuffle button */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <ActionButtons
          onRefresh={fetchImages}
          loading={loading}
          refreshLabel="Shuffle Collection"
        />
      </motion.div>
    </section>
  );
}

/* ── Individual bento card ── */
function BentoCard({
  item,
  index,
  hasImageBg,
}: {
  item: NasaImage;
  index: number;
  hasImageBg: boolean;
}) {
  return (
    <motion.div
      className={`${GRID_CLASSES[index]} relative rounded-2xl overflow-hidden group cursor-default`}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
    >
      {hasImageBg ? (
        /* ── Image-background card ── */
        <>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes={
              index === 0
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          {/* text */}
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6">
            <p className="text-xs font-mono text-indigo-300/70 tracking-wider mb-1">
              {item.date}
            </p>
            <h3 className="text-sm md:text-lg font-bold text-white leading-snug line-clamp-2">
              {item.title}
            </h3>
          </div>
        </>
      ) : (
        /* ── Glass-panel card ── */
        <div className="glass-panel h-full rounded-2xl p-4 md:p-6 flex flex-col justify-end border border-white/5 hover:border-indigo-500/20 transition-colors duration-300">
          <p className="text-xs font-mono text-indigo-400/60 tracking-wider mb-2">
            {item.date}
          </p>
          <h3 className="text-sm md:text-base font-bold text-white leading-snug line-clamp-2 mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
