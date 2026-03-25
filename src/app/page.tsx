"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ABCIslandsMap from "@/components/ABCIslandsMap";
import LogosSection from "@/components/LogosSection";
import ServicesTimelineSection from "@/components/ServicesTimelineSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import WhyConnectoSection from "@/components/WhyConnectoSection";
import PricingSection from "@/components/PricingSection";
import PortfolioSection, { BookingSection } from "@/components/PortfolioSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const BackgroundMusic = dynamic(() => import("@/components/BackgroundMusic"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Header />
      <HeroSection />
      <ABCIslandsMap />
      <LogosSection />
      <ServicesTimelineSection />
      <HowWeWorkSection />
      <PortfolioSection />
      <BookingSection />
      <WhyConnectoSection />
      <PricingSection />
      <CTASection />
      <Footer />
      <BackgroundMusic />
    </main>
  );
}
