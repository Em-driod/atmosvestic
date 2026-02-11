import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Building2, Trash2, X, ChevronDown, ArrowUpRight, ArrowDownLeft, Command, Search, Filter } from 'lucide-react';
import { API_BASE_URL } from '../../constants';

const AccountingManager = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [newTx, setNewTx] = useState({
        type: 'Expense',
        category: 'Salary',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchTransactions = async (month: number, year: number) => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/transactions?month=${month}&year=${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTransactions(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API_BASE_URL}/api/admin/transactions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(newTx)
            });
            setIsModalOpen(false);
            fetchTransactions(selectedMonth, selectedYear);
        } catch (error) { console.error(error); }
    };

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const filteredTransactions = filter === 'All' ? transactions : transactions.filter(t => t.type === filter);

    return (
        <div className="min-h-screen bg-[#FBFBFB] text-[#1D1D1F] font-sans antialiased">
            {/* MOBILE FLOATING NAV */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full shadow-2xl active:scale-95 transition-transform"
                >
                    <Plus size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">New Entry</span>
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 lg:py-20">
                {/* 01. NAVIGATION & BRAND */}
                <nav className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <Command size={16} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Ledger.Studio</span>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="hidden lg:flex items-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] px-5 py-2.5 rounded-full text-xs font-bold transition-all">
                        <Plus size={16} /> Add Transaction
                    </button>
                </nav>

                {/* 02. HERO STAT (CLEAN & BOLD) */}
                <header className="mb-20">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Current Liquidity</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter">
                            ₦{netProfit.toLocaleString()}
                        </h1>
                        <div className="flex gap-4">
                            <div className="px-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Inflow</p>
                                <p className="text-lg font-bold text-emerald-600">+{totalIncome.toLocaleString()}</p>
                            </div>
                            <div className="px-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Outflow</p>
                                <p className="text-lg font-bold text-red-500">-{totalExpenses.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 03. FILTER BAR */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {['All', 'Income', 'Expense', 'Asset'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-white border border-gray-100 text-gray-500 hover:border-gray-300"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-white border border-gray-100 text-gray-500 hover:border-gray-300"
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 04. TRANSACTIONS LIST */}
                <div className="space-y-2">
                    {filteredTransactions.map((tx) => (
                        <div key={tx._id} className="group flex items-center justify-between p-4 md:p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                    {tx.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold tracking-tight">{tx.description || 'General Entry'}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className={`text-lg font-bold tracking-tighter ${tx.type === 'Income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {tx.type === 'Income' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </p>
                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 05. MODAL (APPLE-STYLE SHEET) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6  bg-white">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-12 relative animate-in slide-in-from-bottom-full duration-500">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold tracking-tight">New Transaction</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:rotate-90 transition-transform">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-8">
                            <div className="flex p-1 bg-gray-100 rounded-2xl">
                                {['Income', 'Expense', 'Asset'].map(t => (
                                    <button
                                        key={t} type="button"
                                        onClick={() => setNewTx({ ...newTx, type: t })}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newTx.type === t ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Amount</label>
                                    <input
                                        type="number"
                                        placeholder="₦ 0.00"
                                        className="w-full text-5xl font-medium tracking-tighter outline-none placeholder:text-gray-200"
                                        onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
                                        <select className="bg-transparent w-full text-sm font-bold outline-none appearance-none" onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}>
                                            <option>Sales</option>
                                            <option>Supplies</option>
                                            <option>Salary</option>
                                            <option>Rent</option>
                                        </select>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Date</label>
                                        <input type="date" className="bg-transparent w-full text-sm font-bold outline-none" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Note / Description"
                                    className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-black/5"
                                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                                />
                            </div>

                            <button className="w-full bg-black text-white py-5 rounded-[2rem] font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10">
                                Create Transaction
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountingManager;