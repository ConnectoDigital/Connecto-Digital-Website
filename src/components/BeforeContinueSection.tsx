"use client";

import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";

export default function BeforeContinueSection() {
    return (
        <section className="relative bg-black py-24 md:py-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary">
                                Your Development Partner
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            We are changing how companies operate in The Caribbean & LATAM using the latest technologies
                        </p>
                    </motion.div>

                    {/* Spline 3D Robot */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.6 }}
                        className="relative h-[400px] md:h-[500px]"
                    >
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="w-full h-full"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
