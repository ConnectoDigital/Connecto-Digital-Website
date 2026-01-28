import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesTimelineSection from "@/components/ServicesTimelineSection";
import BeforeContinueSection from "@/components/BeforeContinueSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import PortfolioSection from "@/components/PortfolioSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Header />
      <HeroSection />
      <ServicesTimelineSection />
      <BeforeContinueSection />
      <HowWeWorkSection />
      <PortfolioSection />
      <CTASection />
      <Footer />
    </main>
  );
}
