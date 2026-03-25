"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Subscribe",
    description:
      "Pick a plan that fits your workload and pay monthly, with no contracts and no minimum commitment. Pause or cancel to the next month whenever you need to.",
  },
  {
    number: "02",
    title: "Request",
    description:
      "Send your work through our platform, email, or wherever your team already communicates. We tackle one request at a time in the order you set.",
  },
  {
    number: "03",
    title: "Ship",
    description:
      "You'll receive deliverables every 2-5 business days with unlimited revisions until you're happy. Quality guaranteed, every time.",
  },
  {
    number: "04",
    title: "Repeat",
    description:
      "Submit your next request and we keep going the same way. Your backlog shrinks and your product gets better, month after month.",
  },
];

export default function HowWeWorkSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-driven: calculate active step based on scroll position within section
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // How far through the section we've scrolled (0 to 1)
      // Start counting when section top hits bottom of viewport
      // End when section bottom hits top of viewport
      const scrollStart = rect.top - viewportHeight;
      const scrollEnd = rect.bottom;
      const totalScroll = scrollEnd - scrollStart;
      const currentScroll = -scrollStart;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));

      // Map progress to step index
      // Give each step an equal portion, but weight it so steps change
      // in the middle 60% of the scroll (not at very top/bottom)
      const adjustedProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(adjustedProgress * steps.length)
      );

      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="bg-black"
      id="how-we-work"
      ref={sectionRef}
      // Extra tall section so scroll has room to drive the steps
      style={{ minHeight: "150vh" }}
    >
      <div className="sticky top-0 min-h-screen flex items-center py-20">
        <div className="container mx-auto px-6 md:px-12 w-full">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <p className="font-mono-accent text-xs text-white/30 tracking-[0.2em] mb-4">
              THE PROCESS
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              How It <span className="text-primary">Works</span>
            </h2>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-start">
            {/* Left: Steps */}
            <div>
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.number}
                    className="cursor-pointer"
                    onClick={() => setActiveStep(i)}
                  >
                    <div className="py-6 md:py-8 border-b border-white/5">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Active indicator */}
                        <div className="mt-2 flex items-center gap-3 min-w-[50px]">
                          <div
                            className="w-2.5 h-2.5 transition-all duration-500"
                            style={{
                              backgroundColor: isActive ? "#FF541F" : "transparent",
                              transform: isActive ? "scale(1)" : "scale(0)",
                            }}
                          />
                          <span
                            className="font-mono-accent text-sm transition-colors duration-500"
                            style={{
                              color: isActive
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(255,255,255,0.15)",
                            }}
                          >
                            {step.number}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3
                            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-2 transition-colors duration-500"
                            style={{
                              color: isActive ? "white" : "rgba(255,255,255,0.2)",
                            }}
                          >
                            {step.title}
                          </h3>

                          <div
                            className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                            style={{
                              maxHeight: isActive ? "150px" : "0px",
                              opacity: isActive ? 1 : 0,
                            }}
                          >
                            <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-md pt-1 pb-2">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Image */}
            <div className="relative hidden md:block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5">
                <Image
                  src="/Mitchell_Diego.JPG"
                  alt="Our development process"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                {/* Step progress bar */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-700"
                        style={{
                          backgroundColor:
                            i <= activeStep
                              ? "#FF541F"
                              : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="font-mono-accent text-[10px] text-white/40 mt-3 tracking-widest transition-all duration-500">
                    STEP {steps[activeStep].number} —{" "}
                    {steps[activeStep].title.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
