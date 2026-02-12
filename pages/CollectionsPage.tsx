import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

interface CollectionsPageProps {
    liveProducts: Product[];
    onAddToCart: (p: Product) => void;
}

const CollectionsPage: React.FC<CollectionsPageProps> = ({ liveProducts, onAddToCart }) => {
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {filteredProducts.map((p, idx) => (
                        <ProductCard key={(p as any)._id || p.id} product={p} index={idx} onAddToCart={onAddToCart} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
