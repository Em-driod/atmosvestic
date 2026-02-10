import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Instagram, Twitter, Phone, MapPin } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const menuLinks = [
    { name: 'Collections', path: '/collections' },
    { name: 'Maison', path: '/maison' },
    { name: 'Adire', path: '/adire' },
    { name: 'Journal', path: '/journal' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[80] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Menu Content - Carpet Roll Animation */}
      <div className={`fixed top-0 left-0 w-full z-[90] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col bg-white p-6 md:p-8 rounded-b-[2rem] shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <Link to="/" onClick={onClose} className="font-serif text-2xl tracking-tight text-atmos-dark font-bold italic">Atmos.</Link>
            <button onClick={onClose} className="p-2 bg-black text-white rounded-full transition-transform active:scale-90">
              <X size={20} />
            </button>
          </div>

          {/* Links - Scaled down for better mobile proportions */}
          <nav className="flex flex-col space-y-4 mb-10">
            {menuLinks.map((link, idx) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={onClose}
                className="group flex items-end justify-between border-b border-gray-100 pb-3"
              >
                <span className="font-serif text-3xl md:text-4xl hover:italic transition-all duration-300">
                  {link.name}
                </span>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Footer Info - Tightened spacing */}
          <div className="pt-6 border-t border-gray-200">
             <div className="grid grid-cols-2 gap-6">
                <div>
                   <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Atelier</h4>
                   <p className="text-[11px] leading-relaxed text-gray-600">
                     Agba Dam Area,<br/>Ilorin, NG.
                   </p>
                </div>
                <div>
                   <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Concierge</h4>
                   <div className="flex flex-col gap-1">
                      <a href="https://wa.me/2348069813105" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold underline">WhatsApp</a>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-4 mt-8 opacity-30">
                <Instagram size={18} />
                <Twitter size={18} />
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;