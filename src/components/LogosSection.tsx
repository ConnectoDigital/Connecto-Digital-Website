"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
  { src: "/1.png", alt: "Client 1" },
  { src: "/2.png", alt: "Client 2" },
  { src: "/3.png", alt: "Client 3" },
  { src: "/4.png", alt: "Client 4" },
  { src: "/5.png", alt: "Client 5" },
  { src: "/6.png", alt: "Client 6" },
  { src: "/7.png", alt: "Client 7" },
  { src: "/8.png", alt: "Client 8" },
];

export default function LogosSection() {
  const tripled = [...logos, ...logos, ...logos];

  return (
    <section className="py-6 md:py-8 bg-black overflow-hidden border-t border-b border-white/5">
      <div className="flex items-center gap-8 px-6 md:px-12 mb-6">
        <p className="font-mono-accent text-[10px] md:text-xs text-white/30 tracking-[0.15em] whitespace-nowrap leading-relaxed">
          WE HAVE WORKED WITH BRANDS
          <br className="md:hidden" />
          <span className="hidden md:inline"> </span>
          THAT CARE ABOUT CRAFT
        </p>
      </div>

      <div className="flex relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-14 md:gap-20 items-center whitespace-nowrap px-4"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {tripled.map((logo, index) => (
            <div
              key={index}
              className="relative w-[200px] h-[80px] md:w-[260px] md:h-[100px] shrink-0 opacity-40 hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center gap-3 px-6 md:px-12 mt-4">
        <span className="font-mono-accent text-[10px] text-white/15 tracking-widest">
          + MANY MORE
        </span>
      </div>
    </section>
  );
}
