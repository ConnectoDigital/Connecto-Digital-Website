"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo */}
          <Link href="/" className="relative h-[70px] w-[180px] flex-shrink-0">
            <Image
              src="/connecto-logo.png"
              alt="Connecto Digital"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Center: Menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="font-mono-accent flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            <span>MENU</span>
            <span className="flex flex-col gap-[5px]">
              <span className="block w-5 h-[1.5px] bg-current" />
              <span className="block w-5 h-[1.5px] bg-current" />
            </span>
          </button>

          {/* Right: CTA */}
          <Link
            href="/get-started"
            className="hidden md:flex items-center gap-3"
          >
            <span className="font-mono-accent text-sm border border-primary text-primary px-5 py-2.5 hover:bg-primary hover:text-white transition-all duration-300">
              START PROJECT
            </span>
            <span className="w-10 h-10 border border-primary text-primary flex items-center justify-center text-lg hover:bg-primary hover:text-white transition-all duration-300">
              +
            </span>
          </Link>
        </div>
      </header>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
