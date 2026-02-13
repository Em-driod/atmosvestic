import React from 'react';
import { Product } from '../types';
import { API_BASE_URL } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductCardProps {
    product: Product;
    index: number;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onAddToCart }) => {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div ref={ref} className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden mb-3 bg-atmos-accent/20 cursor-pointer clip-image transition-all duration-700">

                <img
                    src={product.image.startsWith('/uploads') ? `${API_BASE_URL}${product.image}` : product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 opacity-100 blur-0"
                />

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <button
                    onClick={() => onAddToCart(product)}
                    className="absolute bottom-6 right-6 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-atmos-dark hover:text-white z-20"
                >
                    Add
                </button>
            </div>
            <div className="flex justify-between items-start px-1">
                <div>
                    <h3 className="font-serif text-base md:text-lg mb-1">{product.name}</h3>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{product.category}</p>
                </div>
                <span className="font-medium text-sm md:text-base">₦{product.price.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default ProductCard;
