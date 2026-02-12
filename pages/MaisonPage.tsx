import { useEffect } from 'react';
import { MapPin, Phone } from 'lucide-react';

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
                                <p className="text-gray-500 text-base mb-2 font-medium"> 806 981 3105</p>
                                <p className="text-gray-400 text-sm">Open 10:00 - 18:00 WAT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaisonPage;
