"use client";
import RadialOrbitalTimeline from "@/components/RadialOrbitalTimeline";
import { Search, Map, Code, Gauge, Rocket } from "lucide-react";

export default function HowWeWorkSection() {
    const timelineData: any[] = [
        {
            id: 1,
            title: "Discovery & Research",
            date: "Phase 1",
            content: "Understanding your unique needs and goals. We dive deep into your business requirements.",
            category: "Research",
            icon: Search,
            relatedIds: [2],
            status: "completed",
            energy: 80,
        },
        {
            id: 2,
            title: "Strategy & Planning",
            date: "Phase 2",
            content: "Creating a roadmap for success. We outline the technical approach and milestones.",
            category: "Planning",
            icon: Map,
            relatedIds: [1, 3],
            status: "completed",
            energy: 90,
        },
        {
            id: 3,
            title: "Design & Development",
            date: "Phase 3",
            content: "Bringing your vision to life. Our team builds the solution using cutting-edge tech.",
            category: "Development",
            icon: Code,
            relatedIds: [2, 4],
            status: "in-progress",
            energy: 100,
        },
        {
            id: 4,
            title: "Testing & Optimization",
            date: "Phase 4",
            content: "Ensuring quality and performance. Rigorous testing before go-live.",
            category: "Quality",
            icon: Gauge,
            relatedIds: [3, 5],
            status: "pending",
            energy: 60,
        },
        {
            id: 5,
            title: "Launch & Support",
            date: "Phase 5",
            content: "Ongoing assistance and maintenance. We support you post-launch.",
            category: "Launch",
            icon: Rocket,
            relatedIds: [4],
            status: "pending",
            energy: 40,
        },
    ];

    return (
        <section className="bg-black overflow-hidden relative z-10 py-16" id="how-we-work">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">How We Work</h2>
                <p className="text-white/60">Our streamlined approach to delivering exceptional results</p>
            </div>

            {/* Mobile: Simple list */}
            <div className="md:hidden container mx-auto px-4">
                <div className="space-y-6">
                    {timelineData.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                    <p className="text-white/60 text-sm">{item.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop: Orbital animation */}
            <div className="hidden md:block h-screen">
                <RadialOrbitalTimeline timelineData={timelineData} />
            </div>
        </section>
    );
}
