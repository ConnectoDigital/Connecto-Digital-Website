"use client";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

export default function ServicesTimelineSection() {
    const data = [
        {
            title: "Web Development",
            content: (
                <div>
                    <div className="mb-8 overflow-hidden rounded-lg border border-white/10 relative h-64 w-full">
                        <Image
                            src="/boat-mockup.png"
                            alt="Web Development Mockup"
                            fill
                            loading="lazy"
                            className="object-cover object-top"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Frontend Excellence</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Next.js, React, Tailwind CSS animations.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Backend Robustness</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Scalable APIs, database management, and security.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">CMS Integration</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Easy content management with Sanity, Contentful, or Strapi.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Performance First</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Core Web Vitals optimization for lightning-fast speeds.</p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Web Apps",
            content: (
                <div>
                    <div className="mb-8 overflow-hidden rounded-lg border border-white/10 relative h-64 w-full">
                        <Image
                            src="/Dashboard.webp"
                            alt="Web Apps Dashboard"
                            fill
                            loading="lazy"
                            className="object-cover object-top"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">SaaS Development</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Full-cycle product development from MVP to scale.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Custom Portals</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Client portals, employee dashboards, and admin panels.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Real-time Features</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Chat, notifications, and live data updates.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Scalable Architecture</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Built to handle growth and high traffic loads.</p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Automations",
            content: (
                <div>
                    <div className="mb-8 overflow-hidden rounded-lg border border-white/10 relative h-64 w-full">
                        <Image
                            src="/Automations.webp"
                            alt="Automations Dashboard"
                            fill
                            loading="lazy"
                            className="object-cover object-top"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">AI Integration</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">GPT-4, Claude, and custom model integration.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Workflow Automation</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Zapier, Make.com, and n8n workflows.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">CRM & Leads</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Automated lead capture and nurturing.</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-primary font-bold mb-2 text-lg">Data Sync</h4>
                            <p className="text-sm text-neutral-400 leading-relaxed">Keep data consistent across all platforms.</p>
                        </div>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="w-full bg-black">
            <Timeline data={data} />
        </div>
    );
}
