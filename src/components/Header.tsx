import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-8 py-1 flex items-center justify-between shadow-lg shadow-black/20">
                <Link href="/" className="relative h-[80px] w-[160px] flex-shrink-0">
                    <Image
                        src="/connecto-logo.png"
                        alt="Connecto Digital"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#services" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Services
                    </Link>
                    <Link href="#how-we-work" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        How We Work
                    </Link>
                    <Link href="#portfolio" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Projects
                    </Link>
                </nav>

                <a href="https://wa.me/2975629582" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 transition-all">
                        Book A Call
                    </Button>
                </a>
            </div>
        </header>
    );
}
