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
        <section className="h-[70vh] md:h-screen bg-black overflow-hidden relative" id="how-we-work">
            <div className="absolute top-8 left-0 w-full text-center z-20 pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">How We Work</h2>
                <p className="text-white/60">Our streamlined approach to delivering exceptional results</p>
            </div>
            <RadialOrbitalTimeline timelineData={timelineData} />
        </section>
    );
}
