import Link from "next/link";
import { Facebook, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* About Column */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Connecto Digital</h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            We're a team of designers, engineers, and innovators building AI tools that empower anyone to turn imagination into stunning visuals—faster, smarter, and effortlessly.
                        </p>
                    </div>

                    {/* Useful Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Useful Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Services</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Team</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Prices</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Help</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Customer Support</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Connect With Us */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Connect With Us</h3>
                        <address className="not-italic text-sm text-white/60 space-y-2">
                            <p>27 Division St, New York,</p>
                            <p>NY 10002, USA</p>
                            <p className="text-white hover:text-primary transition-colors cursor-pointer">+123 324 2653</p>
                            <p className="text-white hover:text-primary transition-colors cursor-pointer">username@mail.com</p>
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
