"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function PortfolioSection() {
    const projects = [
        {
            title: "Private Boat Tours",
            image: "/boat-mockup.png",
            description: "Booking platform for private boat tours in Aruba.",
            tags: ["UI DESIGN", "UX DESIGN", "WEB DEVELOPMENT"]
        },
        {
            title: "Logistic Company Web App",
            image: "/egaroshi-mockup.png",
            description: "International shipping and logistics platform.",
            tags: ["WEB PLATFORM", "AUTOMATION", "UI DESIGN"]
        },
        {
            title: "Car Wash Booking",
            image: "/roadready-mockup.png",
            description: "Booking and payment system for car wash services.",
            tags: ["WEB PLATFORM", "PAYMENT SYSTEM", "AUTOMATION"]
        }
    ];

    return (
        <section className="py-16 bg-black relative z-20 overflow-hidden" id="portfolio">
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="container mx-auto px-4">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white">Featured Projects</h2>
                </motion.div>
            </div>

            {/* Auto-scrolling Carousel */}
            <div className="relative w-full">
                {/* Gradient overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                {/* Scrolling container - duplicated for seamless loop */}
                <div className="flex animate-scroll">
                    {/* First set */}
                    {projects.map((p, index) => (
                        <div
                            key={`first-${index}`}
                            className="flex-shrink-0 w-[350px] md:w-[450px] group cursor-pointer mx-3"
                        >
                            <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden mb-4 border border-transparent group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">{p.title}</h3>
                            <p className="text-white/50 text-sm mb-3">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {p.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-white/70 border-white/20 text-xs px-3 py-1 font-mono group-hover:border-primary/40 transition-colors duration-300">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* Second set (duplicate for seamless loop) */}
                    {projects.map((p, index) => (
                        <div
                            key={`second-${index}`}
                            className="flex-shrink-0 w-[350px] md:w-[450px] group cursor-pointer mx-3"
                        >
                            <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden mb-4 border border-transparent group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">{p.title}</h3>
                            <p className="text-white/50 text-sm mb-3">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {p.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-white/70 border-white/20 text-xs px-3 py-1 font-mono group-hover:border-primary/40 transition-colors duration-300">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
