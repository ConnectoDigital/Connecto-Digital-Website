"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Next.js, React, and Tailwind CSS. From marketing sites to complex platforms — built for performance, SEO, and conversion.",
    features: ["Frontend Excellence", "Backend APIs", "CMS Integration", "Performance Optimization"],
    href: "/get-started?service=web-development",
  },
  {
    number: "02",
    title: "Web Apps",
    description:
      "SaaS products, client portals, admin dashboards, and real-time applications. Scalable architecture from MVP to enterprise.",
    features: ["SaaS Development", "Custom Portals", "Real-time Features", "Scalable Architecture"],
    href: "/get-started?service=web-apps",
  },
  {
    number: "03",
    title: "Automations",
    description:
      "AI integration, workflow automation, CRM pipelines, and data synchronization. Make your business run on autopilot.",
    features: ["AI Integration", "Workflow Automation", "CRM & Leads", "Data Sync"],
    href: "/get-started?service=automations",
  },
];

export default function ServicesTimelineSection() {
  return (
    <section className="py-24 md:py-32 bg-black" id="services">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-4">
            WHAT WE DO
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Our <span className="text-primary">Services</span>
          </h2>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={service.href} className="group block bg-black p-8 md:p-10 h-full hover:bg-white/[0.02] transition-colors duration-500">
                {/* Number */}
                <span className="font-mono-accent text-5xl md:text-6xl font-bold text-white/[0.06] group-hover:text-primary/20 transition-colors duration-500">
                  {service.number}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/40 leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-primary rounded-full" />
                      <span className="font-mono-accent text-xs text-white/50">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Arrow CTA */}
                <div className="flex items-center gap-2 font-mono-accent text-xs text-white/30 group-hover:text-primary transition-colors duration-300">
                  <span>LEARN MORE</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                    &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
