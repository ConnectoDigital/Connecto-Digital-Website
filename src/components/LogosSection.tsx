"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LogosSection() {
    // Repeated pattern of logos including Connecto
    const logos = [
        { name: "Connecto Digital", src: "/logo.png" },
        { name: "Google", src: null }, // Placeholder
        { name: "Microsoft", src: null }, // Placeholder
        { name: "Amazon", src: null }, // Placeholder
        { name: "Connecto Digital", src: "/logo.png" },
        { name: "Meta", src: null }, // Placeholder
        { name: "Apple", src: null }, // Placeholder
        { name: "Netflix", src: null }, // Placeholder
    ];

    return (
        <section className="py-12 bg-black overflow-hidden border-b border-white/5">
            <div className="container mx-auto px-4 mb-8">
                <p className="text-center text-sm text-white/40 uppercase tracking-widest">Trusted by industry leaders</p>
            </div>

            <div className="flex relative">
                <motion.div
                    className="flex gap-16 items-center whitespace-nowrap px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {/* Triple the logos for seamless loop */}
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex items-center justify-center w-40 h-16 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            {logo.src ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={logo.src}
                                        alt={logo.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="text-xl font-bold text-white/50">{logo.name}</span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
