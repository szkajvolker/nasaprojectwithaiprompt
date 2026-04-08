"use client";

import { motion } from "framer-motion";
import { RefreshCw, ArrowUp } from "lucide-react";
import { returnToOrbit } from "@/lib/scroll";

interface ActionButtonsProps {
  onRefresh: () => void;
  loading: boolean;
  refreshLabel: string;
  loadingLabel?: string;
}

export default function ActionButtons({
  onRefresh,
  loading,
  refreshLabel,
  loadingLabel = "Loading...",
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <motion.button
        onClick={onRefresh}
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
          {loading ? loadingLabel : refreshLabel}
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
  );
}
