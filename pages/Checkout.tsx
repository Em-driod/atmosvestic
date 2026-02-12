import React, { useState } from 'react';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { API_BASE_URL } from '../constants';

interface CheckoutProps {
    cart: CartItem[];
    total: number;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, total }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Format Order Details (Part 1)
        const itemsList = cart.map(item =>
            `- ${item.name} (${item.category}) x${item.quantity}: ₦${(item.price * item.quantity).toLocaleString()}`
        ).join('%0A');

        const partOne =
            `*New Order Request* %0A` +
            `--------------------------------%0A` +
            `*Order Summary* %0A` +
            itemsList + `%0A%0A` +
            `*Total: ₦${total.toLocaleString()}*`;

        // 2. Format Customer Details (Part 2)
        const partTwo =
            `*Customer Details* %0A` +
            `Name: ${formData.fullName} %0A` +
            `Phone: ${formData.phone} %0A` +
            `Address: ${formData.address}, ${formData.city}, ${formData.state} %0A` +
            `Email: ${formData.email} %0A` +
            `--------------------------------%0A` +
            `I would like to proceed with payment.`;

        // Combine with spacing to simulate "two messages"
        const finalMessage = `${partOne}%0A%0A%0A${partTwo}`;

        // 4. Send to WhatsApp (Updated Number)
        window.open(`https://wa.me/2348069813105?text=${finalMessage}`, '_blank');
        setLoading(false);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-atmos-light flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <h2 className="font-serif italic text-4xl">Your bag is empty.</h2>
                    <Link to="/collections" className="inline-block px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

                {/* Left Col: Form */}
                <div className="space-y-12 animate-fade-up">
                    <div>
                        <Link to="/collections" className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-8 transition-colors">
                            <ArrowLeft size={16} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Back to Shopping</span>
                        </Link>
                        <h1 className="font-serif italic text-5xl mb-4">Checkout.</h1>
                        <p className="text-gray-500 font-light">Please enter your delivery details to complete your order via WhatsApp.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Contact Info</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                />
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-2">Delivery Address</h3>
                            <div className="space-y-6">
                                <input
                                    required
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                />
                                <input
                                    required
                                    name="address"
                                    type="text"
                                    placeholder="Street Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                />
                                <div className="grid grid-cols-2 gap-6">
                                    <input
                                        required
                                        name="city"
                                        type="text"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                    />
                                    <input
                                        required
                                        name="state"
                                        type="text"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none p-4 rounded-lg focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-atmos-indigo transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? 'Processing...' : 'Place Order via WhatsApp'}
                            <Check size={16} />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
                            <Lock size={12} />
                            <span>Secure Checkout</span>
                        </div>
                    </form>
                </div>

                {/* Right Col: Order Summary */}
                <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] h-fit animate-fade-up sticky top-32">
                    <h3 className="font-serif italic text-3xl mb-8">Order Summary</h3>
                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex gap-6 items-center">
                                <div className="w-16 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={item.image.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-serif text-lg leading-none mb-1">{item.name}</h4>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{item.category}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                        <span className="font-medium text-sm">₦{item.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Shipping</span>
                            <span>Computed via WhatsApp</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-4 mt-4">
                            <span>Total</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
