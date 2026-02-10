import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Star, X, UploadCloud, ChevronDown, Search, ArrowRight, ArrowUpRight, Image } from 'lucide-react';

const ProductManager = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('All Pieces');
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '', price: 0, category: 'Ready-to-Wear', image: '', description: '', isTopProduct: false
    });

    const categories = ['All Pieces', 'Ready-to-Wear', 'Adire fabrics', 'Ankara fabrics', 'Asoebi collections'];

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('http://localhost:5000/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Fetch Products Error:", error);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const formData = new FormData();

        Object.entries(newProduct).forEach(([key, value]) => {
            if (key !== 'image') {
                formData.append(key, String(value));
            }
        });

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const url = editingId
            ? `http://localhost:5000/api/admin/products/${editingId}`
            : 'http://localhost:5000/api/admin/products';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error('Failed to save product');
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error("Save Product Error:", error);
        }
    };

    const startEdit = (product: any) => {
        setNewProduct({ ...product });
        setEditingId(product._id);
        setImagePreview(product.image.startsWith('/uploads') ? `http://localhost:5000${product.image}` : product.image);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (error) {
            console.error("Delete Product Error:", error);
        }
    };

    const toggleTopProduct = async (product: any) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/admin/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isTopProduct: !product.isTopProduct })
            });
            if (!res.ok) throw new Error('Failed to update top product status');
            fetchProducts();
        } catch (error) {
            console.error("Toggle Top Product Error:", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = () => {
        setEditingId(null);
        setNewProduct({ name: '', price: 0, category: 'Ready-to-Wear', image: '', description: '', isTopProduct: false });
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const filteredProductsBySearch = products.filter(p => {
        const matchesCategory = selectedCategory === 'All Pieces' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="max-w-[1440px] mx-auto px-4 py-6 md:px-12 md:py-10 space-y-5 md:space-y-6">

                {/* CLEAN HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                            Products
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">{products.length} items in inventory</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto">
                        <div className="relative group w-full sm:w-72">
                            <Search size={14} className="absolute ml-3 md:ml-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                            <input
                                type="text"
                                placeholder=""
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 md:py-3 pl-9 md:pl-11 pr-3 md:pr-4 text-xs md:text-sm font-medium outline-none focus:border-gray-400 focus:bg-white transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openModal}
                            className="h-10 md:h-10 px-4 md:px-5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 md:gap-2 font-semibold text-xs md:text-sm active:scale-95"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            <span>Add Product</span>
                        </button>
                    </div>
                </header>

                {/* MODERN CATEGORY NAVIGATION */}
                <nav className="flex overflow-x-auto gap-2 md:gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                {/* PRODUCT GRID */}
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredProductsBySearch.map((p) => (
                        <article key={p._id} className="group relative flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                <img
                                    src={p.image && p.image.startsWith('/uploads') ? `http://localhost:5000${p.image}` : p.image}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    alt={p.name}
                                    onError={(e: any) => e.target.src = 'https://via.placeholder.com/1200x1600'}
                                />

                                {/* ACTION OVERLAY */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleTopProduct(p)}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm ${p.isTopProduct
                                                    ? 'bg-yellow-400 text-black'
                                                    : 'bg-white/90 text-gray-700 hover:bg-white'
                                                    }`}
                                                title="Top Product"
                                            >
                                                <Star size={14} fill={p.isTopProduct ? 'currentColor' : 'none'} strokeWidth={2} />
                                            </button>
                                            <button
                                                onClick={() => startEdit(p)}
                                                className="w-9 h-9 bg-white/90 rounded-lg text-gray-700 flex items-center justify-center hover:bg-white transition-all backdrop-blur-sm"
                                                title="Edit"
                                            >
                                                <Edit size={14} strokeWidth={2} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="w-9 h-9 bg-red-500/90 rounded-lg text-white flex items-center justify-center hover:bg-red-600 transition-all backdrop-blur-sm"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} strokeWidth={2} color='red' />
                                        </button>
                                    </div>
                                </div>

                                {/* TOP PRODUCT BADGE */}
                                {p.isTopProduct && (
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-yellow-400 text-black px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                                            <Star size={10} fill="currentColor" />
                                            <span>Top</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="p-3 flex flex-col flex-1">
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-500 font-medium  mb-0.5">{p.category}</p>
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                                            {p.name}
                                        </h3>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 shrink-0">₦{p.price.toLocaleString()}</p>
                                </div>

                                {p.description && (
                                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                                        {p.description}
                                    </p>
                                )}

                                <button
                                    onClick={() => startEdit(p)}
                                    className="mt-auto pt-2 text-xs font-semibold text-gray-400 hover:text-black transition-colors text-left flex items-center gap-1"
                                >
                                    Edit product
                                    <ArrowRight size={12} />
                                </button>
                            </div>
                        </article>
                    ))}

                    {/* ADD PRODUCT CARD */}
                    <button
                        onClick={openModal}
                        className="aspect-[3/4] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group"
                    >
                        <div className="w-14 h-14 rounded-full bg-white border border-gray-300 flex items-center justify-center group-hover:border-gray-400 group-hover:scale-110 transition-all">
                            <Plus size={24} className="text-gray-400 group-hover:text-gray-600" strokeWidth={2} />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-semibold block text-gray-600 group-hover:text-gray-900">Add Product</span>
                            <span className="text-xs text-gray-400 mt-1 block">Create new item</span>
                        </div>
                    </button>
                </main>

                {/* ELEVATED MODAL REFINEMENT */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

                        <div className="bg-white w-full max-w-[480px] relative animate-fade-up overflow-hidden flex flex-col shadow-2xl rounded-lg">

                            {/* COMPACT IMAGE UPLOAD */}
                            <div className="bg-gray-50 p-6 relative flex items-center justify-center border-b border-gray-100">
                                <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" />

                                {imagePreview ? (
                                    <div className="relative w-32 h-40 shadow-lg group overflow-hidden rounded">
                                        <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <UploadCloud size={24} className="text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-white rounded flex items-center justify-center mx-auto border border-gray-100">
                                            <Image size={24} className="text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Upload Image</p>
                                    </div>
                                )}
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col bg-white">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-black">{editingId ? 'Edit Product' : 'New Product'}</h3>
                                    <button type="button" onClick={closeModal} className="text-gray-300 hover:text-black transition-colors">
                                        <X size={20} strokeWidth={2} />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Product Name</label>
                                        <input
                                            className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-black focus:bg-white transition-all"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            placeholder="Enter name" required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Category</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2.5 pr-8 text-sm font-semibold text-black outline-none focus:border-black focus:bg-white transition-all appearance-none cursor-pointer"
                                                    value={newProduct.category}
                                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                                >
                                                    {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Price (₦)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-black focus:bg-white transition-all"
                                                value={newProduct.price === 0 ? '' : newProduct.price}
                                                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                                placeholder="0" required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setNewProduct({ ...newProduct, isTopProduct: !newProduct.isTopProduct })}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded border text-xs font-bold transition-all ${newProduct.isTopProduct ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300'}`}
                                        >
                                            <Star size={13} fill={newProduct.isTopProduct ? 'currentColor' : 'none'} className={newProduct.isTopProduct ? 'text-yellow-400' : 'text-gray-300'} />
                                            <span>Top Product</span>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Description</label>
                                        <textarea
                                            rows={2}
                                            className="w-full bg-gray-50 border border-gray-100 rounded px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-black focus:bg-white transition-all resize-none"
                                            value={newProduct.description}
                                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                            placeholder="Optional description..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wide">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-black text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-all active:scale-95">
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
