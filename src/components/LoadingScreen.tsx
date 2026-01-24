"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading time (can be removed if we want purely interaction-based)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <div className="relative w-full max-w-md flex flex-col items-center">

                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-64 h-24 mb-12"
                >
                    <Image
                        src="/logo.png"
                        alt="Connecto Digital"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                {/* Slogan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                        Building Tech That
                    </h2>
                    <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">
                        Drive More Business
                    </h2>
                </motion.div>

                {/* Enter Button */}
                <AnimatePresence>
                    {!isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-[-80px]"
                        >
                            <Button
                                onClick={onComplete}
                                size="lg"
                                className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 text-lg font-medium transition-all hover:scale-105"
                            >
                                Enter Site <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Indicator (if needed) */}
                {isLoading && (
                    <motion.div
                        className="absolute bottom-[-80px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
