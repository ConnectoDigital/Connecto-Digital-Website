"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Planning Animation Component
function PlanningAnimation() {
    const [activeNode, setActiveNode] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNode((prev) => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const nodes = [
        { x: 70, y: 30 },
        { x: 70, y: 80 },
        { x: 70, y: 130 },
    ];

    return (
        <div className="relative w-full h-64 md:h-72 flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="grid-planning" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-planning)" />
                </svg>
            </div>

            {/* Central Icon - Clipboard/Planning */}
            <motion.div
                className="relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center"
                animate={{
                    boxShadow: [
                        "0 0 20px rgba(249, 115, 22, 0.2)",
                        "0 0 40px rgba(249, 115, 22, 0.4)",
                        "0 0 20px rgba(249, 115, 22, 0.2)",
                    ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-500" strokeWidth="1.5">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <path d="M9 12h6M9 16h6" />
                </svg>
            </motion.div>

            {/* Floating checklist items */}
            {nodes.map((node, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{ right: `${node.x}px`, top: `${node.y}px` }}
                    initial={{ opacity: 0.5 }}
                    animate={{
                        opacity: activeNode === index ? 1 : 0.5,
                        scale: activeNode === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                        activeNode === index
                            ? "bg-orange-500/20 border-orange-500/50"
                            : "bg-white/5 border-white/20"
                    }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={activeNode === index ? "text-orange-500" : "text-white/40"} strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </motion.div>
            ))}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
                {nodes.map((node, index) => (
                    <motion.line
                        key={index}
                        x1="50%"
                        y1="50%"
                        x2={`calc(100% - ${node.x + 16}px)`}
                        y2={`${node.y + 16}px`}
                        stroke={activeNode === index ? "rgba(249, 115, 22, 0.5)" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                    />
                ))}
            </svg>
        </div>
    );
}

// Development Animation Component
function DevelopmentAnimation() {
    const codeLines = [
        { num: 1, text: "import", keyword: "{ App } from './core'", color: "text-orange-500" },
        { num: 2, text: "const", keyword: "config = {", color: "text-purple-400" },
        { num: 3, text: "  api:", keyword: "'/v1/data',", color: "text-white/80" },
        { num: 4, text: "  auth:", keyword: "true,", color: "text-white/80" },
        { num: 5, text: "}", keyword: "", color: "text-white/80" },
        { num: 6, text: "export", keyword: "default App", color: "text-orange-500" },
    ];

    return (
        <div className="relative w-full h-64 md:h-72 flex items-center justify-center px-4">
            <motion.div
                className="w-full max-w-[280px] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Editor header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="text-white/40 text-xs ml-2">app.tsx</span>
                </div>

                {/* Code editor content */}
                <div className="p-3 font-mono text-xs">
                    {codeLines.map((line, index) => (
                        <motion.div
                            key={line.num}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <span className="text-white/30 w-4 text-right select-none">{line.num}</span>
                            <span className={line.color}>{line.text}</span>
                            <span className="text-green-400/80">{line.keyword}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Typing cursor effect */}
                <motion.div
                    className="absolute bottom-4 right-8 w-2 h-4 bg-orange-500"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </motion.div>
        </div>
    );
}

// Testing/Deployment Animation Component
function TestingAnimation() {
    const [activeButton, setActiveButton] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveButton((prev) => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const buttons = [
        { icon: "⚡", label: "Trigger" },
        { icon: "☐", label: "Prompts" },
        { icon: "☐", label: "Send Email" },
    ];

    return (
        <div className="relative w-full h-64 md:h-72 flex items-center justify-center">
            <div className="flex flex-col gap-3">
                {buttons.map((button, index) => (
                    <motion.div
                        key={button.label}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                            activeButton === index
                                ? "bg-orange-500/20 border-orange-500/50 shadow-lg shadow-orange-500/20"
                                : "bg-white/5 border-white/10"
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: activeButton === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <span className={`text-sm ${activeButton === index ? "text-orange-500" : "text-white/40"}`}>
                            {index === 0 ? "⚡" : "☐"}
                        </span>
                        <span className={`text-sm ${activeButton === index ? "text-white" : "text-white/60"}`}>
                            {button.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Connection arrows */}
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
                <motion.path
                    d="M 80 60 Q 60 80 80 100"
                    fill="none"
                    stroke="rgba(249, 115, 22, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.path
                    d="M 80 100 Q 60 120 80 140"
                    fill="none"
                    stroke="rgba(249, 115, 22, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
                />
            </svg>
        </div>
    );
}

// Service Card Component
interface ServiceCardProps {
    title: string;
    description: string;
    animation: React.ReactNode;
}

function ServiceCard({ title, description, animation }: ServiceCardProps) {
    return (
        <motion.div
            className="relative bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors duration-300"
            variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        duration: 0.6,
                        ease: "easeOut"
                    }
                }
            }}
        >
            {/* Title */}
            <div className="text-center pt-8 pb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
            </div>

            {/* Animation area */}
            <div className="px-6">
                {animation}
            </div>

            {/* Description */}
            <div className="p-8 pt-4 text-center">
                <p className="text-white/60 text-base leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

export default function HowWeWorkSection() {
    const services = [
        {
            title: "Planning",
            description: "We start by understanding your goals, mapping out requirements, and creating a clear roadmap for success.",
            animation: <PlanningAnimation />,
        },
        {
            title: "Development",
            description: "Our team builds your solution using modern technologies, with regular updates and transparent communication.",
            animation: <DevelopmentAnimation />,
        },
        {
            title: "Testing & Deployment",
            description: "Rigorous testing ensures quality, followed by seamless deployment and ongoing support for your project.",
            animation: <TestingAnimation />,
        },
    ];

    return (
        <section className="bg-black overflow-hidden relative z-10 py-20 md:py-32" id="how-we-work">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">How We Work</h2>
                    <p className="text-white/60">Our streamlined approach to delivering exceptional results</p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {services.map((service) => (
                        <ServiceCard
                            key={service.title}
                            title={service.title}
                            description={service.description}
                            animation={service.animation}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
