import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu } from 'lucide-react';

interface NavbarProps {
    onOpenMenu: () => void;
    onOpenCart: () => void;
    cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMenu, onOpenCart, cartCount }) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > window.innerHeight - 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let navStyles = "";
    if (isHome) {
        if (scrolled) {
            navStyles = "bg-black text-white py-4 shadow-2xl";
        } else {
            navStyles = "bg-white/90 backdrop-blur-md text-black py-6 shadow-sm";
        }
    } else {
        navStyles = "bg-black text-white py-6";
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 transition-all duration-700 ease-in-out  ${navStyles}`}>
            <div className="flex items-center gap-12">
                <Link to="/" className="text-2xl font-serif italic tracking-tight font-bold whitespace-nowrap"><img src="/jeff.jpeg" className='rounded-full w-10 md:w-16' alt="" /></Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/collections" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Collections</Link>
                    <Link to="/maison" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Maison</Link>
                    <Link to="/adire" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition-opacity">Adire</Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button onClick={onOpenCart} className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
                <button onClick={onOpenMenu} className="p-2 hover:bg-black/5 rounded-full md:hidden">
                    <Menu size={20} />
                </button>
                <div className={`hidden md:block h-6 w-px opacity-20 mx-2 ${scrolled && isHome ? 'bg-white' : 'bg-current'}`}></div>
                <Link to="/journal" className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60">Journal</Link>
            </div>
        </nav>
    );
};

export default Navbar;
