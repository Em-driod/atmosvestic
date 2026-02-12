import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, MapPin, ArrowUpRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
    liveProducts: Product[];
    onAddToCart: (p: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ liveProducts, onAddToCart }) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const displayProducts = liveProducts.filter(p => (p as any).isTopProduct).slice(0, 3);
    const productsToShow = displayProducts.length > 0 ? displayProducts : liveProducts.slice(0, 3);
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    return (
        <div className="min-h-screen">
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                {!isVideoLoaded && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                        <div className="text-white font-serif text-xl animate-pulse">Loading Atmos...</div>
                    </div>
                )}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    onCanPlay={handleVideoLoad}
                    className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-60' : 'opacity-0'}`}
                >
                    <source src='/vid.mp4' type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70"></div>

                <div className={`relative z-10 text-center px-6 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100 animate-fade-in' : 'opacity-0'} pt-20`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white mb-8 block">New Collection Drop</span>
                    <h1 className="font-serif italic text-6xl md:text-[10rem] text-white leading-[0.9] tracking-tighter mb-12 drop-shadow-2xl uppercase">
                        ATMOS <br /> VESTIARY.
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link
                            to="/collections"
                            className="px-12 py-5 bg-white text-atmos-dark rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-atmos-indigo hover:text-white transition-all transform hover:scale-105 shadow-2xl"
                        >
                            Explore Collection
                        </Link>
                        <button className="group flex items-center gap-4 text-white hover:opacity-70 transition-opacity">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Process</span>
                            <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={14} fill="white" />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 left-8 md:left-12 flex items-center gap-4 text-white/40">
                    <MapPin size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Agba Dam Area, Ilorin, NG</span>
                </div>
            </section>

            <section className="py-32 px-8 md:px-12 bg-atmos-light">
                <div className="max-w-360 mx-auto">
                    <div className="mb-24 flex flex-col md:flex-row justify-between items-baseline gap-8">
                        <div className="max-w-xl animate-fade-up">
                            <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Modern Elegance.</h2>
                            <p className="text-gray-500 text-lg leading-relaxed font-light">
                                Premium Adire and Ankara fabrics blended with culture and contemporary style.
                                We specialize in ready-to-wear pieces and bespoke fashion for women who value class and comfort.
                            </p>
                        </div>
                        <Link to="/collections" className="text-xs font-bold uppercase tracking-[0.3em] border-b-2 border-atmos-dark pb-2 hover:opacity-50 transition-all">
                            Top Products
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {productsToShow.map((p, idx) => (
                            <ProductCard key={(p as any)._id || p.id} product={p} index={idx} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-48 px-8 md:px-12 bg-white overflow-hidden">
                <div className="max-w-360 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div className="relative animate-fade-up grid grid-cols-2 gap-8">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src="/five.jpeg" alt="Fashion wear" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl -translate-y-16">
                            <img src="/seven.jpeg" alt="Fashion wear" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                    </div>
                    <div className="space-y-12 animate-fade-up">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-atmos-indigo">The Maison</span>
                        <h2 className="text-5xl md:text-7xl font-serif italic leading-[1.1]">
                            Culture, Elegance, and Contemporary Style.
                        </h2>
                        <p className="text-gray-500 text-xl font-light leading-relaxed max-w-lg">
                            ATMOS VESTIARY is known for quality craftsmanship, tasteful designs, and excellent customer service.
                            Based in Ilorin, Kwara State, we deliver nationwide and internationally.
                        </p>
                        <Link
                            to="/maison"
                            className="inline-flex items-center gap-4 text-atmos-dark group"
                        >
                            <div className="w-16 h-16 rounded-full bg-atmos-accent flex items-center justify-center group-hover:bg-atmos-indigo group-hover:text-white transition-colors duration-500">
                                <ArrowUpRight size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Our Story</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
