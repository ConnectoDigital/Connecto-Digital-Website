"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Private Boat Tours",
    image: "/boat-mockup.png",
    description: "Booking platform for private boat tours in Aruba.",
    tags: ["UI DESIGN", "UX DESIGN", "WEB DEVELOPMENT"],
    year: "2024",
  },
  {
    title: "Egaroshi Logistics",
    image: "/egaroshi-mockup.png",
    description: "International shipping and logistics platform.",
    tags: ["WEB PLATFORM", "AUTOMATION", "UI DESIGN"],
    year: "2024",
  },
  {
    title: "RoadReady Car Wash",
    image: "/roadready-mockup.png",
    description: "Booking and payment system for car wash services.",
    tags: ["WEB PLATFORM", "PAYMENT SYSTEM", "AUTOMATION"],
    year: "2025",
  },
];

export default function PortfolioSection() {
  return (
    <section className="py-24 md:py-32 bg-black" id="portfolio">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16 md:mb-24"
        >
          <div>
            <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-4">
              SELECTED WORK
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Featured <span className="text-primary">Projects</span>
            </h2>
          </div>
          <p className="hidden md:block font-mono-accent text-xs text-white/20">
            {projects.length} PROJECTS
          </p>
        </motion.div>

        {/* Project list — full width */}
        <div className="space-y-px bg-white/5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-black hover:bg-white/[0.02] transition-colors duration-500"
            >
              <div className="flex flex-col md:flex-row gap-5 p-5 md:p-6 items-start md:items-center">
                {/* Number */}
                <span className="font-mono-accent text-xs text-white/20 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Image */}
                <div className="relative w-full md:w-[180px] aspect-video md:aspect-[16/10] shrink-0 overflow-hidden bg-white/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-accent text-[9px] text-white/30 border border-white/10 px-2.5 py-0.5 group-hover:border-primary/30 group-hover:text-white/50 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                  <span className="font-mono-accent text-xs text-white/20">
                    {project.year}
                  </span>
                  <span className="font-mono-accent text-sm text-white/10 group-hover:text-primary transition-colors duration-300">
                    &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export function BookingSection() {
  return (
    <section className="py-24 md:py-32 bg-black" id="booking">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16 md:mb-24"
        >
          <div>
            <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-4">
              GET STARTED
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Book a <span className="text-primary">Call</span>
            </h2>
          </div>
          <p className="hidden md:block font-mono-accent text-xs text-white/20">
            15 MIN INTRO
          </p>
        </motion.div>

        {/* Content: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 flex flex-col justify-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Let&apos;s discuss your{" "}
              <span className="text-primary">project.</span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Pick a time that works for you. We&apos;ll hop on a quick 15-minute intro call to learn about your goals and see how we can help.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary shrink-0" />
                <span className="font-mono-accent text-[11px] text-white/40 tracking-wide">
                  NO COMMITMENT REQUIRED
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary shrink-0" />
                <span className="font-mono-accent text-[11px] text-white/40 tracking-wide">
                  FREE CONSULTATION
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary shrink-0" />
                <span className="font-mono-accent text-[11px] text-white/40 tracking-wide">
                  RESPONSE WITHIN 24 HOURS
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Cal.com embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="border border-white/[0.06] bg-white/[0.02] p-4 md:p-6">
              <div className="relative w-full overflow-hidden bg-white rounded-sm" style={{ height: "580px" }}>
                <iframe
                  src="https://cal.com/mitchell-connecto/15min?embed=true&theme=light&layout=month_view"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: "none", minHeight: "580px" }}
                  title="Book a call with Connecto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
