"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 md:py-40 bg-black relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-6">
            LET&apos;S BUILD SOMETHING
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-8">
            READY TO
            <br />
            <span className="text-primary">BUILD?</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto mb-12 leading-relaxed">
            Whether you need a website, a web app, or automation — we&apos;re
            ready to be your development partner.
          </p>

          <Link href="/get-started" className="inline-flex items-center gap-3">
            <span className="font-mono-accent text-sm border border-primary text-primary px-8 py-4 hover:bg-primary hover:text-white transition-all duration-300">
              START YOUR PROJECT
            </span>
            <span className="w-12 h-12 border border-primary text-primary flex items-center justify-center text-xl hover:bg-primary hover:text-white transition-all duration-300">
              +
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
