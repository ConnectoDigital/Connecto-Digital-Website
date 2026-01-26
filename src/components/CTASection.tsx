import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Design Smarter?</h2>
                <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                    Whether you're a freelancer, a team, or a growing agency—our tools adapt to your workflow. Design faster. Deliver better.
                </p>
                <a href="https://wa.me/2975629582" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg rounded-full">
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </a>
            </div>
        </section>
    );
}
