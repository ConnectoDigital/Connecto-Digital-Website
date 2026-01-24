import { Badge } from "@/components/ui/badge";

export default function PortfolioSection() {
    const categories = ["Web Development", "Mobile Applications", "AI Integration", "Custom Solutions", "Enterprise Systems"];
    const projects = [
        {
            title: "E-Commerce Platform",
            category: "Web Development",
            image: "/boat-mockup.png",
            description: "A high-conversion online store with seamless checkout."
        },
        {
            title: "SaaS Dashboard",
            category: "Web App",
            image: "/boat-mockup.png",
            description: "Real-time analytics dashboard for a logistics company."
        },
        {
            title: "Real Estate Portal",
            category: "Web Development",
            image: "/boat-mockup.png",
            description: "Property listing platform with advanced filtering."
        },
        {
            title: "CRM Integration",
            category: "Automation",
            image: "/boat-mockup.png",
            description: "Automated lead flow from website to CRM."
        }
    ];

    return (
        <section className="py-24 bg-black border-t border-white/5" id="portfolio">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Featured Projects</h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, i) => (
                            <Badge key={i} variant="outline" className="text-white/70 border-white/20 hover:bg-white/10 cursor-pointer px-4 py-2">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((p) => (
                        <div key={p.title} className="group relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10">
                            <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                                    <p className="text-primary font-medium">View Case Study</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
