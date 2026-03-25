"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "WORK", href: "#portfolio" },
  { label: "SERVICES", href: "#services" },
  { label: "PROCESS", href: "#how-we-work" },
  { label: "CONTACT", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden" id="contact">
      <div className="container mx-auto px-6 md:px-12">
        {/* Top section: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-20 pb-16 border-t border-white/5">
          {/* Left: Newsletter */}
          <div>
            <p className="text-white text-sm mb-6">
              Don&apos;t miss out on future updates.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-3 max-w-sm"
            >
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none transition-colors"
              />
              <div className="flex gap-0">
                <button
                  type="submit"
                  className="flex-1 font-mono-accent text-sm bg-white text-black py-3 px-6 hover:bg-white/90 transition-colors"
                >
                  SUBSCRIBE
                </button>
                <button
                  type="submit"
                  className="w-12 bg-white text-black flex items-center justify-center text-lg border-l border-black/10 hover:bg-white/90 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-white/20 text-xs">Unsubscribe anytime.</p>
            </form>

            {/* Status messages */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary" />
                <span className="font-mono-accent text-[11px] text-white/40">
                  ACCEPTING PROJECTS. JOIN THE WAITLIST.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary" />
                <span className="font-mono-accent text-[11px] text-white/40">
                  ONLY 3 SPOTS LEFT
                </span>
              </div>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="flex justify-center">
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block font-mono-accent text-sm text-white/40 hover:text-white transition-colors text-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Contact */}
          <div className="md:text-right">
            <div className="space-y-2 mb-6">
              <a
                href="mailto:info@connectodigital.com"
                className="block text-sm text-white/60 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
              >
                info@connectodigital.com
              </a>
              <a
                href="https://wa.me/2975629582"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/60 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
              >
                +297 562 9582
              </a>
            </div>

            <div className="space-y-2 mb-6">
              <Link
                href="/privacy"
                className="block text-sm text-white/30 hover:text-white/60 underline underline-offset-4 decoration-white/10 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal"
                className="block text-sm text-white/30 hover:text-white/60 underline underline-offset-4 decoration-white/10 transition-colors"
              >
                Legal Notice
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright center */}
        <div className="text-center pb-8 space-y-1">
          <p className="text-white/20 text-sm" suppressHydrationWarning>
            &copy; {new Date().getFullYear()}
          </p>
          <p className="text-white/20 text-sm">Connecto Digital.</p>
          <p className="text-white/20 text-sm">
            Your development partner.
          </p>
        </div>
      </div>

      {/* Giant logo at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative flex justify-center pb-10 pointer-events-none select-none"
      >
        <Image
          src="/connecto-logo.png"
          alt=""
          width={1200}
          height={400}
          className="w-[90vw] max-w-[1200px] h-auto opacity-100 brightness-0 invert"
        />
      </motion.div>
    </footer>
  );
}
