import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import LogosSection from "@/components/LogosSection";
import ServicesTimelineSection from "@/components/ServicesTimelineSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Header />
      <HeroSection />
      <StatsSection />
      <LogosSection />
      <ServicesTimelineSection />
      <HowWeWorkSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
