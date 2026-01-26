import Link from "next/link";
import { Facebook, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* About Column */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Connecto Digital</h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            We're a team of designers, engineers, and innovators building AI tools that empower anyone to turn imagination into stunning visuals—faster, smarter, and effortlessly.
                        </p>
                    </div>

                    {/* Connect With Us */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Connect With Us</h3>
                        <address className="not-italic text-sm text-white/60 space-y-2">
                            <p>Aruba</p>
                            <Link href="https://wa.me/2975629582" target="_blank" className="block text-white hover:text-primary transition-colors cursor-pointer">+297 562 9582</Link>
                            <p className="text-white hover:text-primary transition-colors cursor-pointer">info@connectodigital.com</p>
                        </address>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="#" className="text-white/60 hover:text-primary transition-colors"><Facebook size={20} /></Link>
                            <Link href="#" className="text-white/60 hover:text-primary transition-colors"><Github size={20} /></Link>
                            <Link href="#" className="text-white/60 hover:text-primary transition-colors"><Twitter size={20} /></Link>
                            <Link href="#" className="text-white/60 hover:text-primary transition-colors"><Linkedin size={20} /></Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">© 2024 Connecto Digital. All Right Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
