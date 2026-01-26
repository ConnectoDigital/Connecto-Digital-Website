import { Badge } from "@/components/ui/badge";

export default function PortfolioSection() {
    const projects = [
        {
            title: "Private Boat Tours",
            image: "/boat-mockup.png",
            description: "Booking platform for private boat tours in Aruba.",
            tags: ["UI DESIGN", "UX DESIGN", "WEB DEVELOPMENT"]
        },
        {
            title: "Logistic Company Web App",
            image: "/egaroshi-mockup.png",
            description: "International shipping and logistics platform.",
            tags: ["WEB PLATFORM", "AUTOMATION", "UI DESIGN"]
        },
        {
            title: "Psychologist Booking",
            image: "/brainy-mockup.png",
            description: "Professional booking system for assessments.",
            tags: ["UI DESIGN", "UX DESIGN", "WEB DEVELOPMENT"]
        },
        {
            title: "Car Wash Booking",
            image: "/roadready-mockup.png",
            description: "Booking and payment system for car wash services.",
            tags: ["WEB PLATFORM", "PAYMENT SYSTEM", "AUTOMATION"]
        }
    ];

    return (
        <section className="py-16 bg-black relative z-20" id="portfolio">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">Featured Projects</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((p) => (
                        <div key={p.title} className="group">
                            <div className="relative aspect-video bg-white/5 rounded-xl overflow-hidden mb-4">
                                <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{p.title}</h3>
                            <p className="text-white/50 text-sm mb-3">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {p.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-white/70 border-white/20 text-xs px-3 py-1 font-mono">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
