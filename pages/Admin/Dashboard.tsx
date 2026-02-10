import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Receipt,
    LogOut,
    Bell,
    Search,
    TrendingUp,
    DollarSign,
    Package,
    Activity,
    Calendar,
    ArrowUpRight
} from 'lucide-react';

import OrderManager from './OrderManager';
import ProductManager from './ProductManager';
import AccountingManager from './AccountingManager';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin');

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    const tabs = [
        { id: 'orders', label: 'DASHBOARD', icon: LayoutDashboard },
        { id: 'products', label: 'CATALOG', icon: ShoppingBag },
        { id: 'accounting', label: 'LEDGER', icon: Receipt },
    ];

    return (
        <div className="flex h-screen bg-white text-black font-sans overflow-hidden selection:bg-red-500 selection:text-white">
            {/* SIDEBAR - 20% PURE BLACK ELITE */}
            <aside className="w-20 md:w-[20%] bg-black flex flex-col z-[49] transition-all duration-500 border-r border-white/5 shrink-0">
                <div className="h-32 flex items-center px-6 md:px-12">
                    <div className="flex items-center gap-4 group justify-center md:justify-start w-full">
                        <div className="w-12 h-12 bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/40 group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out shrink-0">
                            <ShoppingBag size={20} className="text-white" />
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none">ATMOS.</span>
                            <span className="text-red-600 text-[8px] font-black tracking-[0.4em] mt-1">VESTIARY</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 md:px-8 py-10 space-y-6">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-center md:justify-start gap-4 px-5 md:px-6 py-5 transition-all duration-500 border-2 group ${isActive
                                    ? 'bg-white text-black border-red-600 shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                                    : 'text-gray-500 border-transparent hover:bg-white hover:text-black hover:border-red-600'
                                    }`}
                            >
                                <Icon size={20} className={`transition-transform duration-500 shrink-0 ${isActive ? 'scale-110 md:scale-100' : 'group-hover:scale-110'}`} />
                                <span className="hidden md:block text-[10px] font-black tracking-[0.3em] uppercase truncate">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 md:p-12">
                    <button
                        onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}
                        className="w-full h-16 group flex items-center justify-center md:justify-start md:px-6 gap-4 border border-white/10 text-gray-400 hover:text-white hover:border-red-600 hover:bg-red-600 transition-all duration-500"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 md:group-hover:translate-x-1 transition-transform shrink-0" />
                        <span className="hidden md:block text-[9px] font-black tracking-[0.3em] uppercase">TERMINATE</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB]/50">
                {/* SOFT PREMIUM HEADER */}
                <header className="h-20 px-8 md:px-12 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-gray-100 z-40 sticky top-0 shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-red-500/70 tracking-[0.4em] uppercase mb-1">ATMOS // {activeTab}</span>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab)?.label}
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-10">
                        {/* Quiet Search */}
                        <div className="relative group hidden lg:block">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Universal Search..."
                                className="bg-gray-50/50 border border-transparent focus:border-gray-100 py-2.5 pl-10 pr-4 text-[11px] font-medium rounded-xl outline-none transition-all w-60 focus:w-80"
                            />
                        </div>

                        <div className="h-8 w-px bg-gray-100"></div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-gray-400 leading-none">SESSION</p>
                                <p className="text-[11px] font-black text-gray-800">{currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                            </div>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-red-500">
                                <Bell size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE SURFACE */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {/* MANAGER MOUNT */}
                    <div className="animate-fade-up">
                        {activeTab === 'orders' && <OrderManager />}
                        {activeTab === 'products' && <ProductManager />}
                        {activeTab === 'accounting' && <AccountingManager />}
                    </div>
                </div>

                {/* BOTTOMLINE STATS / QUICK ACTION */}
                <div className="h-20 bg-black text-white px-12 flex items-center justify-between shrink-0">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">OPERATIONAL STATUS: ELITE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black italic tracking-widest text-red-600">MISSION CONTROL // ATMOS</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
