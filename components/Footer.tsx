import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-32 pb-16 px-6 md:px-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">

                    {/* Brand Section */}
                    <div className="md:col-span-5">
                        <span className="font-serif italic text-4xl mb-8 block tracking-tighter">ATMOS VESTIARY</span>
                        <p className="max-w-sm text-gray-400 text-sm leading-relaxed mb-12 font-light">
                            A modern African fashion brand that blends culture, elegance, and contemporary style. <br />
                            Specializing in premium Adire and Ankara fabrics. Crafted in Ilorin, curated for the world.
                        </p>

                        <div className="relative group max-w-sm">
                            <input
                                type="email"
                                placeholder="JOIN THE MAISON"
                                className="bg-transparent border-b border-white/20 py-3 text-[10px] tracking-[0.3em] uppercase focus:outline-none focus:border-white w-full transition-all duration-500 placeholder:text-gray-600"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                                <ArrowRight size={18} strokeWidth={1} />
                            </button>
                        </div>
                    </div>

                    {/* Spacing Column */}
                    <div className="hidden md:block md:col-span-1"></div>

                    {/* Links Section 1 */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] mb-10 text-gray-500">Explore</h4>
                        <ul className="space-y-5 text-[13px] font-light">
                            <li><Link to="/collections" className="text-gray-400 hover:text-white transition-colors duration-300">Collections</Link></li>
                            <li><Link to="/maison" className="text-gray-400 hover:text-white transition-colors duration-300">The Maison</Link></li>
                            <li><Link to="/adire" className="text-gray-400 hover:text-white transition-colors duration-300">The Adire Process</Link></li>
                        </ul>
                    </div>

                    {/* Links Section 2 */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] mb-10 text-gray-500">Connect</h4>
                        <ul className="space-y-5 text-[13px] font-light">
                            <li><a href="https://wa.me/2348069813105" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">WhatsApp Atelier</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Instagram</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Inquiries</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <span className="text-[9px] tracking-[0.4em] uppercase text-gray-600">© 2026 ATMOS VESTIARY</span>
                        <div className="flex gap-8 text-[9px] tracking-[0.4em] uppercase text-gray-600">
                            <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
                            <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
                            <Link to="/admin" className="cursor-pointer hover:text-white transition-colors">Maison Access</Link>
                        </div>
                    </div>

                    <div className="flex gap-6 text-gray-500">
                        <Facebook size={16} strokeWidth={1} className="hover:text-white transition-colors cursor-pointer" />
                        <Twitter size={16} strokeWidth={1} className="hover:text-white transition-colors cursor-pointer" />
                        <Instagram size={16} strokeWidth={1} className="hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
