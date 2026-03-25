"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SERVICES", href: "#services" },
  { label: "WORK", href: "#portfolio" },
  { label: "HOW WE WORK", href: "#how-we-work" },
  { label: "CONTACT", href: "#contact" },
];

const socialLinks = [
  { label: "INSTAGRAM", href: "https://instagram.com" },
  { label: "LINKEDIN", href: "https://linkedin.com" },
  { label: "WHATSAPP", href: "https://wa.me/2975629582" },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col"
        >
          {/* Close button */}
          <div className="flex justify-end p-6 md:p-12">
            <button
              onClick={onClose}
              className="font-mono-accent text-sm text-white/70 hover:text-white transition-colors flex items-center gap-3"
            >
              <span>CLOSE</span>
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex flex-col justify-center px-6 md:px-20">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center gap-6 py-4 md:py-5 border-b border-white/5"
                >
                  <span className="font-mono-accent text-xs text-white/30 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-4xl md:text-6xl lg:text-7xl font-light text-white group-hover:text-primary transition-colors duration-300">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom: social links + CTA */}
          <div className="flex items-center justify-between px-6 md:px-20 pb-8">
            <div className="flex gap-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-accent text-xs text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link
              href="/get-started"
              onClick={onClose}
              className="font-mono-accent text-sm border border-primary text-primary px-5 py-2.5 hover:bg-primary hover:text-white transition-all duration-300"
            >
              START PROJECT
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
