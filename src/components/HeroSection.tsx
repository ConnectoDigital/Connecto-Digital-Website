"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useState, useEffect } from "react";
import Image from "next/image";

const headlines = [
    {
        id: 1,
        content: (
            <>
                Web Design<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary">That Drive Business</span>
            </>
        )
    },
    {
        id: 2,
        content: (
            <>
                Web Apps That<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary">Automate Process</span>
            </>
        )
    },
];

export default function HeroSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % headlines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative bg-black overflow-hidden flex flex-col pt-28 md:pt-36">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

            <ContainerScroll
                titleComponent={
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-12 mt-8 md:mt-16 backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#FF541F]" />
                            <span className="text-sm font-medium text-white/80 tracking-wide">Trusted Partner</span>
                        </motion.div>

                        <div className="h-[160px] md:h-[280px] flex items-center justify-center mb-4 md:mb-8 relative w-full">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={index}
                                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="text-4xl md:text-8xl font-bold text-white tracking-tight leading-tight md:leading-none text-center absolute"
                                >
                                    {headlines[index].content}
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        <p className="max-w-2xl mx-auto text-base md:text-xl text-white/60 mb-6 md:mb-10 leading-relaxed px-4 md:px-0">
                            We're a team of experts who've been delivering digital products for companies in the Caribbean and LATAM.
                        </p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <a href="https://wa.me/2975629582" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg shadow-[0_0_20px_rgba(255,84,31,0.3)] hover:shadow-[0_0_30px_rgba(255,84,31,0.5)] transition-all">
                                    Start Project <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                            <a href="#portfolio">
                                <Button size="lg" variant="ghost" className="text-white hover:bg-white/5 rounded-full px-8 h-14 text-lg">
                                    View Portfolio
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                }
            >
                <div className="w-full h-full relative rounded-3xl overflow-hidden">
                    {/* Mobile image */}
                    <Image
                        src="/crewai.png"
                        alt="AI Automation Agent"
                        fill
                        priority
                        className="object-contain md:hidden"
                    />
                    {/* Desktop image */}
                    <Image
                        src="/automationagent.jpeg"
                        alt="AI Automation Agent"
                        fill
                        priority
                        className="object-contain hidden md:block"
                    />
                </div>
            </ContainerScroll>
        </section>
    );
}
