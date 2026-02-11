import React from 'react';
import { X, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string | number, delta: number) => void;
  onRemove: (id: string | number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleCheckout = () => {
    const message = `*New Order from Website* %0A%0A` +
      cart.map(item => `- ${item.name} (${item.category}) x${item.quantity}: ₦${(item.price * item.quantity).toLocaleString()}`).join('%0A') +
      `%0A%0A*Total: ₦${subtotal.toLocaleString()}* %0A%0A` +
      `I would like to proceed with this order.`;

    window.open(`https://wa.me/2347016969298?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white/50 backdrop-blur">
            <h2 className="font-serif text-3xl italic">Your Bag ({itemCount})</h2>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingBag size={48} className="mb-4" />
                <p className="text-xl font-serif">Your bag is empty</p>
                <button onClick={onClose} className="mt-4 text-sm underline hover:text-indigo-900">Continue Browsing</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={(item as any)._id || item.id} className="flex gap-6 animate-fade-up">
                  <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl leading-none mb-1">{item.name}</h3>
                        <button onClick={() => onRemove((item as any)._id || item.id)} className="text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">{item.category}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity((item as any)._id || item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full text-xs"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity((item as any)._id || item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full text-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm uppercase tracking-widest text-gray-500">Subtotal</span>
                <span className="font-serif text-2xl">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-6 text-center">Shipping & taxes calculated at checkout</p>
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-black text-white rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-atmos-indigo transition-colors group"
              >
                Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;