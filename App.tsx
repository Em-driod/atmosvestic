import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ArrowRight, ArrowUpRight, Play, MapPin, Phone, Instagram, Twitter, Facebook, Check } from 'lucide-react';
import { COLLECTIONS, HERO_VIDEO } from './constants';
import StylistChat from './components/StylistChat';
import TextureOverlay from './components/AdirePattern';
import MobileMenu from './components/MobileMenu';
import CartDrawer from './components/CartDrawer';
import { Product, CartItem } from './types';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/Dashboard';
import Checkout from './pages/Checkout';

// --- UTILS ---

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const formatCurrency = (amount: number) => {
  return `₦${amount.toLocaleString()}`;
};

// --- COMPONENTS ---

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
    navStyles = "bg-white text-atmos-dark py-6 border-b border-gray-100";
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
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-atmos-indigo text-white text-[9px] flex items-center justify-center rounded-full">
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

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onAddToCart }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative aspect-3/4 overflow-hidden mb-6 bg-atmos-accent/20 cursor-pointer clip-image transition-all duration-700">
        <img
          src={product.image.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-atmos-dark hover:text-white"
        >
          Add
        </button>
      </div>
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="font-serif text-xl mb-1">{product.name}</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{product.category}</p>
        </div>
        <span className="font-medium text-lg">{formatCurrency(product.price)}</span>
      </div>
    </div>
  );
};

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

// --- PAGES ---

const HomePage: React.FC<{ liveProducts: Product[], onAddToCart: (p: Product) => void }> = ({ liveProducts, onAddToCart }) => {
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
              All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
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

const MaisonPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="pt-32 pb-24 px-8 md:px-12 bg-atmos-light min-h-screen">
      <div className="max-w-360 mx-auto text-center animate-fade-up">
        <h1 className="text-7xl md:text-9xl font-serif italic mb-12">The Maison.</h1>
        <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl mb-24">
          <img src="/shop.jpeg" alt="The Maison" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 text-left max-w-6xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif">Mission & Vision</h2>
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              <strong>Our Mission:</strong> To promote African fashion through elegant, modern, and high-quality designs while delivering exceptional value and service to our customers.
            </p>
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              <strong>Our Vision:</strong> To build a globally recognized African fashion brand rooted in culture, quality, and innovation.
            </p>
            <h2 className="text-4xl font-serif mt-12">Atmos Base</h2>
            <div className="flex gap-4 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
              <MapPin size={24} className="text-atmos-indigo" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Store Location</h4>
                <p className="text-gray-500 text-sm">Ilorin, Kwara State, Nigeria</p>
                <p className="text-gray-400 text-xs mt-1">We also deliver nationwide and internationally</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-serif">Concierge</h2>
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              For bespoke inquiries, asoebi collections, and atelier visits, our concierge is available
              via WhatsApp.
            </p>
            <div className="flex gap-4 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Phone size={24} className="text-atmos-indigo" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-1">WhatsApp Atelier</h4>
                <p className="text-gray-500 text-base mb-2 font-medium">+234 806 981 3105</p>
                <p className="text-gray-400 text-sm">Open 10:00 - 18:00 WAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionsPage: React.FC<{ liveProducts: Product[], onAddToCart: (p: Product) => void }> = ({ liveProducts, onAddToCart }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Adire fabrics', 'Ankara fabrics', 'Ready-to-Wear', 'Asoebi collections'];
  const filteredProducts = filter === 'All' ? liveProducts : liveProducts.filter(p => p.category === filter);

  return (
    <div className="pt-40 pb-32 px-8 md:px-12 bg-atmos-light min-h-screen">
      <div className="max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8 border-b border-gray-200 pb-12">
          <h1 className="text-7xl font-serif italic">Gallery.</h1>
          <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all px-6 py-3 rounded-full ${filter === cat ? 'bg-atmos-dark text-white' : 'text-gray-400 hover:text-atmos-dark'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
          {filteredProducts.map((p, idx) => (
            <ProductCard key={(p as any)._id || p.id} product={p} index={idx} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

const JournalPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="pt-40 pb-32 px-8 md:px-12 bg-white min-h-screen">
      <div className="max-w-360 mx-auto">
        <h1 className="text-8xl font-serif italic mb-32 text-center">The Journal.</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
          {[
            { title: "The Blue Gold: A History of Indigo", img: "/two.jpeg" },
            { title: "Atelier Sessions: Agba Dam Area", img: "/four.jpeg" }
          ].map((art, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video rounded-[3rem] overflow-hidden mb-8 shadow-xl bg-gray-50 flex items-center justify-center text-gray-300">
                <span className="text-xs uppercase tracking-widest">Article Image</span>
              </div>
              <h3 className="text-3xl font-serif hover:italic transition-all">{art.title}</h3>
              <div className="mt-4 flex items-center gap-4 text-atmos-accent/60">
                <span className="text-[10px] font-bold uppercase tracking-widest">Read Article</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- APP ROOT ---

const AppContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/public/products');
      const data = await res.json();
      setLiveProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLiveProducts([]);
    }
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      fetchProducts();
    }
  }, [location.pathname]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => ((item as any)._id || item.id) === ((product as any)._id || product.id));
      if (existing) {
        return prev.map(item =>
          ((item as any)._id || item.id) === ((product as any)._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to bag`);
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => ((item as any)._id || item.id) !== id));
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (((item as any)._id || item.id) === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };


  return (
    <div className="flex flex-col min-h-screen relative bg-atmos-light text-atmos-dark selection:bg-atmos-indigo selection:text-white overflow-x-hidden">
      <TextureOverlay className="fixed inset-0 z-0 opacity-10" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />

        {/* Toast Notification */}
        <div className={`fixed top-24 right-5 md:right-10 z-[100] bg-black text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-500 transform ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{toast.message}</span>
            <Check size={14} className="text-green-400" />
          </div>
        </div>

        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage liveProducts={liveProducts} onAddToCart={addToCart} />} />
            <Route path="/maison" element={<MaisonPage />} />
            <Route path="/collections" element={<CollectionsPage liveProducts={liveProducts} onAddToCart={addToCart} />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  total={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
                />
              }
            />
            <Route path="*" element={<HomePage liveProducts={liveProducts} onAddToCart={addToCart} />} />
          </Routes>
        </main>

        <Footer />
        <StylistChat />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

