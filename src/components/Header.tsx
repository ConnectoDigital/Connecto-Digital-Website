import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
                <Link href="/" className="relative h-10 w-40 flex-shrink-0">
                    <Image
                        src="/logo.png"
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
                    <Link href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        How it Works
                    </Link>
                    <Link href="#mission" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Mission
                    </Link>
                    <Link href="#projects" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Projects
                    </Link>
                </nav>

                <Button className="bg-gradient-to-r from-primary via-orange-300 to-primary hover:opacity-90 text-white rounded-full px-6 py-2 transition-all">
                    Book A Call <span className="ml-1">↗</span>
                </Button>
            </div>
        </header>
    );
}
