"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "CEO Tech Innovations",
            content: "Working with Connecto Digital transformed our business operations. The AI-powered solutions they implemented saved us countless hours.",
            initial: "S"
        },
        {
            name: "Michael Chen",
            role: "CTO StartupHub",
            content: "Outstanding service and incredible results. The team's expertise in automation is unmatched.",
            initial: "M"
        },
        {
            name: "Emma Rodriguez",
            role: "Founder Digital Ventures",
            content: "From start to finish, the Connecto team delivered beyond our expectations. Highly recommended!",
            initial: "E"
        },
        {
            name: "David Park",
            role: "Director of Marketing",
            content: "The new website improved our conversion rates by 150%. The design is stunning and the performance is flawless.",
            initial: "D"
        },
        {
            name: "Lisa Thompson",
            role: "Operations Manager",
            content: "We were drowning in manual data entry. Connecto's automation workflows have given us our time back.",
            initial: "L"
        }
    ];

    return (
        <section className="py-24 bg-black border-t border-white/5 overflow-hidden" id="testimonials">
            <div className="container mx-auto px-4 mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white text-center">What Our Clients Say</h2>
            </div>

            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-8 px-4"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {[...testimonials, ...testimonials].map((t, index) => (
                            <Card key={index} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors w-[350px] md:w-[450px] flex-shrink-0">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                        <p className="text-white/40 text-xs">{t.role}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={14} className="fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed italic">
                                        "{t.content}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
