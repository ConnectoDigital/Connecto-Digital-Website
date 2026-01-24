import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
    const faqs = [
        {
            question: "What is this platform used for?",
            answer: "It's an AI-powered design assistant that helps you generate, customize, and export creative assets in seconds—whether for personal projects, brand work, or commercial use."
        },
        {
            question: "What happens if I hit my free generation limit?",
            answer: "If you reach your limit, you can wait for the monthly reset or upgrade to our Pro plan for unlimited generations and premium features."
        },
        {
            question: "Do I need design experience to use it?",
            answer: "Not at all! Our platform is built for everyone. The AI handles the heavy lifting, allowing you to focus on your creative vision."
        },
        {
            question: "Can I collaborate with my team?",
            answer: "Yes, our Team plan includes advanced collaboration features like shared workspaces, comment threads, and role-based access control."
        },
        {
            question: "Is it really free to use?",
            answer: "Yes, we offer a generous Free plan that gives you access to essential features so you can experience the power of our platform."
        }
    ];

    return (
        <section className="py-24 bg-black" id="faq">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-white/60">
                        Got questions? We've got answers. Find everything you need to know about using our platform.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg px-4 bg-white/5">
                            <AccordionTrigger className="text-white hover:text-primary transition-colors text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-white/70">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
