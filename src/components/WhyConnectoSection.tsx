"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const rows = [
  {
    label: "WHO DOES THE WORK",
    agency: "Varies by project",
    freelancer: "One person",
    connecto: "Full-stack experts",
  },
  {
    label: "PRICING MODEL",
    agency: "Hourly or project-based",
    freelancer: "Per project",
    connecto: "One monthly fee",
  },
  {
    label: "COMMUNICATION",
    agency: "Through account manager",
    freelancer: "Direct email",
    connecto: "Direct in your channel",
  },
  {
    label: "TURNAROUND",
    agency: "Varies by workload",
    freelancer: "Depends on availability",
    connecto: "2-5 business days",
  },
  {
    label: "RELATIONSHIP",
    agency: "Project-based",
    freelancer: "Project-based",
    connecto: "Ongoing partnership",
  },
  {
    label: "COMMITMENT",
    agency: "Contract-based",
    freelancer: "Per project",
    connecto: "Cancel to the next month",
  },
];

export default function WhyConnectoSection() {
  return (
    <section className="py-24 md:py-32 bg-black text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Title + description + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Why
              <br />
              Connecto?
            </h2>

            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
              Connecto combines the quality of a senior development team with
              the flexibility of a subscription you can pause or cancel to the
              next month.
            </p>

            <Link
              href="#how-we-work"
              className="inline-flex items-center gap-3"
            >
              <span className="font-mono-accent text-sm bg-primary text-white px-5 py-2.5 hover:bg-primary/90 transition-colors">
                SEE HOW IT WORKS
              </span>
              <span className="w-10 h-10 bg-primary text-white flex items-center justify-center text-lg hover:bg-primary/90 transition-colors">
                +
              </span>
            </Link>
          </motion.div>

          {/* Right: Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-[#1a1a1a] text-white rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 border-b border-white/10">
                <div className="p-4 md:p-5" />
                <div className="p-4 md:p-5 border-l border-white/10">
                  <span className="font-mono-accent text-[10px] md:text-xs text-white/50 tracking-wider">
                    TRADITIONAL AGENCY
                  </span>
                </div>
                <div className="p-4 md:p-5 border-l border-white/10">
                  <span className="font-mono-accent text-[10px] md:text-xs text-white/50 tracking-wider">
                    FREELANCER
                  </span>
                </div>
                <div className="p-4 md:p-5 border-l border-white/10 bg-white/[0.03]">
                  <span className="font-mono-accent text-[10px] md:text-xs text-white flex items-center gap-2 tracking-wider">
                    <span className="w-2.5 h-2.5 bg-primary inline-block" />
                    CONNECTO
                  </span>
                </div>
              </div>

              {/* Table rows */}
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 ${
                    i < rows.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <div className="p-4 md:p-5 flex items-center">
                    <span className="font-mono-accent text-[10px] md:text-xs text-white/30 tracking-wider">
                      {row.label}
                    </span>
                  </div>
                  <div className="p-4 md:p-5 border-l border-white/10 flex items-center">
                    <span className="text-xs md:text-sm text-white/60">
                      {row.agency}
                    </span>
                  </div>
                  <div className="p-4 md:p-5 border-l border-white/10 flex items-center">
                    <span className="text-xs md:text-sm text-white/60">
                      {row.freelancer}
                    </span>
                  </div>
                  <div className="p-4 md:p-5 border-l border-white/10 bg-white/[0.03] flex items-center">
                    <span className="text-xs md:text-sm text-white font-medium">
                      {row.connecto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
