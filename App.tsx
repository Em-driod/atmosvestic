import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { API_BASE_URL } from './constants';
import StylistChat from './components/StylistChat';
import TextureOverlay from './components/AdirePattern';
import MobileMenu from './components/MobileMenu';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Product, CartItem } from './types';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MaisonPage = lazy(() => import('./pages/MaisonPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-atmos-light">
    <div className="text-atmos-dark font-serif text-xl animate-pulse tracking-widest uppercase">
      Loading Atmos...
    </div>
  </div>
);

const AppContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/products`);
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
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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
