"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AsciiArt from "./AsciiArt";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden pt-28 md:pt-32">
      {/* ASCII art background - right side on desktop, full background on mobile */}
      <div className="absolute top-24 md:top-20 bottom-0 left-0 right-0 md:left-[45%] opacity-30 md:opacity-100">
        <AsciiArt />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent md:via-black/70 pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-20 md:py-0">
        <div className="max-w-3xl">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono-accent text-xs md:text-sm text-white/40 tracking-[0.2em] mb-8"
          >
            DIGITAL AGENCY // ARUBA
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight mb-8"
          >
            Your
            <br />
            Development
            <br />
            <span className="text-primary">Partner.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed mb-12"
          >
            We build websites, web apps, and automations for businesses across
            the Caribbean & LATAM. One partner, unlimited potential.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-6 flex-wrap"
          >
            <Link href="/get-started" className="flex items-center gap-3">
              <span className="font-mono-accent text-sm border border-primary text-primary px-6 py-3 hover:bg-primary hover:text-white transition-all duration-300">
                START YOUR PROJECT
              </span>
              <span className="w-11 h-11 border border-primary text-primary flex items-center justify-center text-lg hover:bg-primary hover:text-white transition-all duration-300">
                +
              </span>
            </Link>

            <Link
              href="#portfolio"
              className="font-mono-accent text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white"
            >
              View our work
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono-accent text-[10px] text-white/20 tracking-widest">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
