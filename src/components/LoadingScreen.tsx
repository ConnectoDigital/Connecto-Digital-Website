"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  const handleEnter = useCallback(() => {
    sessionStorage.setItem("site-entered", "true");
    setVisible(false);
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    // Skip if already entered this session
    if (sessionStorage.getItem("site-entered")) {
      setVisible(false);
      onComplete();
      return;
    }

    // Auto-enter after logo animation (2.5s)
    const timer = setTimeout(handleEnter, 2500);
    return () => clearTimeout(timer);
  }, [onComplete, handleEnter]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-[200px] h-[80px] md:w-[280px] md:h-[100px] mb-8"
          >
            <Image
              src="/connecto-logo.png"
              alt="Connecto Digital"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="font-mono-accent text-xs text-white/20 tracking-[0.2em]"
          >
            DIGITAL AGENCY // ARUBA
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-10 w-32 h-[2px] bg-white/5 overflow-hidden rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
