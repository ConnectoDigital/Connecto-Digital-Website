export default function StatsSection() {
    const stats = [
        { label: "Clients", value: "120K+" },
        { label: "Projects", value: "150+" },
        { label: "5-Star Reviews", value: "32K+" },
    ];

    return (
        <section className="py-12 bg-black border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-around gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group cursor-default">
                            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                                {stat.value}
                            </h3>
                            <p className="text-white/60 text-sm tracking-wider uppercase">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
