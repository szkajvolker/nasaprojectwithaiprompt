"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ApodData } from "./HeroSection";

export default function ApodCard({ apod }: { apod: ApodData }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageUrl = apod.hdurl || apod.url;
  const isVideo = apod.media_type === "video";

  return (
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="group relative max-w-5xl mx-auto"
    >
      {/* Glow backdrop on hover */}
      <div className="absolute -inset-4 bg-linear-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Card */}
      <div className="relative bg-deep-space/60 backdrop-blur-2xl rounded-2xl border border-white/8 overflow-hidden shadow-2xl shadow-indigo-950/20">
        <div className="flex flex-col lg:flex-row">
          {/* Image / Video */}
          <div className="relative lg:w-1/2 aspect-4/3 lg:aspect-auto lg:min-h-105 overflow-hidden shrink-0">
            {/* Skeleton */}
            {!imgLoaded && !isVideo && (
              <div className="absolute inset-0 bg-[#0a0f2e] animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
              </div>
            )}

            {isVideo ? (
              <div className="w-full h-full min-h-75 lg:min-h-full">
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="w-full h-full min-h-75 lg:min-h-105"
                  allowFullScreen
                />
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={apod.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                priority
              />
            )}

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-deep-space/80 hidden lg:block pointer-events-none" />
          </div>

          {/* Text content */}
          <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
            {/* Date badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono tracking-[0.2em] text-indigo-400/80 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                {apod.date}
              </span>
              {apod.media_type === "video" && (
                <span className="text-xs font-mono tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  VIDEO
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
              {apod.title}
            </h3>

            {/* Description — scrollable */}
            <div className="flex-1 overflow-y-auto  pr-2 mb-4 scrollbar-thin">
              <p className="text-sm leading-relaxed text-white/60">
                {apod.explanation}
              </p>
            </div>

            {/* Credit */}
            {apod.copyright && (
              <p className="text-xs font-mono text-white/25 mt-auto pt-3 border-t border-white/5">
                &copy; {apod.copyright}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
