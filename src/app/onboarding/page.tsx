"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const INDUSTRIES = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Hospitality",
  "Retail",
  "Media & Entertainment",
  "Non-profit",
  "Other",
];

const TIMELINES = [
  "ASAP (1-2 weeks)",
  "Short-term (1 month)",
  "Medium-term (2-3 months)",
  "Long-term (3-6 months)",
  "Ongoing / No deadline",
];

const CHANNELS = ["Slack", "Email", "WhatsApp"];

const TIMEZONES = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00 (PST)",
  "UTC-07:00 (MST)",
  "UTC-06:00 (CST)",
  "UTC-05:00 (EST)",
  "UTC-04:00 (AST)",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00 (GMT)",
  "UTC+01:00 (CET)",
  "UTC+02:00 (EET)",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+05:30 (IST)",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00 (JST)",
  "UTC+10:00 (AEST)",
  "UTC+11:00",
  "UTC+12:00",
];

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function OnboardingPage() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const status = isLoading ? "loading" : session ? "authenticated" : "unauthenticated";
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [brandColors, setBrandColors] = useState("");
  const [logoUrl] = useState("");
  const [designPreferences, setDesignPreferences] = useState("");
  const [projectGoals, setProjectGoals] = useState("");
  const [techStack, setTechStack] = useState("");
  const [timeline, setTimeline] = useState("");
  const [communication, setCommunication] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Load existing onboarding state
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/onboarding");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setCurrentStep(data.step || 1);
            setCompanyName(data.companyName || "");
            setWebsite(data.website || "");
            setIndustry(data.industry || "");
            setBrandColors(data.brandColors || "");
            setDesignPreferences(data.designPreferences || "");
            setProjectGoals(data.projectGoals || "");
            setTechStack(data.techStack || "");
            setTimeline(data.timeline || "");
            setCommunication(data.communication || "");
            setTimezone(data.timezone || "");
          }
        }
      } catch {
        // Proceed with empty state
      } finally {
        setLoaded(true);
      }
    }

    if (status === "authenticated") {
      load();
    }
  }, [status]);

  async function saveStep(step: number, completed = false) {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step,
          completed,
          companyName,
          website,
          industry,
          brandColors,
          logoUrl,
          designPreferences,
          projectGoals,
          techStack,
          timeline,
          communication,
          timezone,
        }),
      });
    } catch {
      // Silent fail, user can retry
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    if (currentStep < 4) {
      await saveStep(currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      await saveStep(4, true);
      router.push("/dashboard");
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  if (status === "loading" || !loaded) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-mono-accent text-xs text-white/40 tracking-wider">
          LOADING...
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") return null;

  const inputClasses =
    "w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors";
  const labelClasses = "font-mono-accent text-[10px] tracking-wider text-white/40 mb-2 block";
  const selectClasses =
    "w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            connecto
          </Link>
          <span className="font-mono-accent text-xs text-white/40 tracking-wider">
            STEP {currentStep} OF 4
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24 max-w-2xl">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 h-[2px] overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: step <= currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              {currentStep === 1 && "COMPANY INFO"}
              {currentStep === 2 && "BRAND & DESIGN"}
              {currentStep === 3 && "PROJECT DETAILS"}
              {currentStep === 4 && "COMMUNICATION"}
            </span>
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              {currentStep}/4
            </span>
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Tell us about your company.
              </h2>
              <p className="text-white/40 text-sm mb-10">
                Basic info so we can tailor everything to your business.
              </p>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>COMPANY NAME</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>WEBSITE</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>INDUSTRY</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>
                      Select your industry
                    </option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-black">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Brand & Design.
              </h2>
              <p className="text-white/40 text-sm mb-10">
                Help us understand your visual identity and preferences.
              </p>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>BRAND COLORS</label>
                  <input
                    type="text"
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                    placeholder="#FF541F, #000000, #FFFFFF"
                    className={inputClasses}
                  />
                  <p className="text-white/20 text-xs mt-1.5">
                    Comma-separated hex codes or color names
                  </p>
                </div>
                <div>
                  <label className={labelClasses}>LOGO UPLOAD</label>
                  <div className="border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                    <div className="font-mono-accent text-xs text-white/30 tracking-wider mb-2">
                      COMING SOON
                    </div>
                    <p className="text-white/20 text-xs">
                      Logo upload will be available shortly. You can share it later via your project channel.
                    </p>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>DESIGN PREFERENCES</label>
                  <textarea
                    value={designPreferences}
                    onChange={(e) => setDesignPreferences(e.target.value)}
                    placeholder="Minimal, dark-themed, modern with sharp edges..."
                    rows={4}
                    className={inputClasses + " resize-none"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Project Details.
              </h2>
              <p className="text-white/40 text-sm mb-10">
                What are you building and how do you want to build it?
              </p>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>PROJECT GOALS</label>
                  <textarea
                    value={projectGoals}
                    onChange={(e) => setProjectGoals(e.target.value)}
                    placeholder="Redesign our marketing site, build a customer portal, automate onboarding..."
                    rows={4}
                    className={inputClasses + " resize-none"}
                  />
                </div>
                <div>
                  <label className={labelClasses}>TECH STACK PREFERENCES</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="Next.js, React, Node.js, or no preference"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>TIMELINE</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>
                      Select a timeline
                    </option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t} className="bg-black">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Communication.
              </h2>
              <p className="text-white/40 text-sm mb-10">
                How do you prefer to stay in touch?
              </p>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>PREFERRED CHANNEL</label>
                  <div className="grid grid-cols-3 gap-3">
                    {CHANNELS.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setCommunication(ch)}
                        className={`py-3 border text-sm font-mono-accent tracking-wider transition-all duration-200 cursor-pointer ${
                          communication === ch
                            ? "border-primary bg-primary/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20"
                        }`}
                      >
                        {ch.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>AVAILABILITY TIMEZONE</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>
                      Select your timezone
                    </option>
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz} className="bg-black">
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="font-mono-accent text-xs tracking-wider text-white/40 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            BACK
          </button>

          <button
            onClick={handleNext}
            disabled={saving}
            className="inline-flex items-center gap-0 cursor-pointer disabled:opacity-50"
          >
            <span className="font-mono-accent text-sm px-5 py-2.5 border border-white text-white hover:bg-white hover:text-black transition-all duration-300">
              {saving
                ? "SAVING..."
                : currentStep === 4
                  ? "FINISH"
                  : "CONTINUE"}
            </span>
            <span className="w-10 h-[42px] border border-white border-l-0 flex items-center justify-center text-lg text-white hover:bg-white hover:text-black transition-all duration-300">
              {currentStep === 4 ? "\u2713" : "\u2192"}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
