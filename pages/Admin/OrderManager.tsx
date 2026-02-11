import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckCircle2, XCircle, Clock, Search, X, ChevronDown, Package, User, Hash, Activity } from 'lucide-react';
import { API_BASE_URL } from '../../constants';

const OrderManager = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        clothDetails: '',
        status: 'Pending',
        totalAmount: 0
    });

    const fetchOrders = async (month: number, year: number) => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/orders?month=${month}&year=${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Fetch Orders Error:", error);
        }
    };

    useEffect(() => {
        fetchOrders(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const url = editingOrder ? `${API_BASE_URL}/api/admin/orders/${editingOrder._id}` : `${API_BASE_URL}/api/admin/orders`;
        const method = editingOrder ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
            closeModal();
            fetchOrders(selectedMonth, selectedYear);
        } catch (error) {
            console.error("Save Order Error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Dissolve this order record?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchOrders(selectedMonth, selectedYear);
        } catch (error) {
            console.error("Delete Order Error:", error);
        }
    };

    const toggleStatus = async (order: any) => {
        const token = localStorage.getItem('adminToken');
        const nextStatus = order.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await fetch(`${API_BASE_URL}/api/admin/orders/${order._id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            fetchOrders(selectedMonth, selectedYear);
        } catch (error) {
            console.error("Status Toggle Error:", error);
        }
    };

    const openModal = (order = null) => {
        if (order) {
            setEditingOrder(order);
            setNewOrder({ ...order });
        } else {
            setEditingOrder(null);
            setNewOrder({ customerName: '', clothDetails: '', status: 'Pending', totalAmount: 0 });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);


    return (
        <div className="space-y-6 pb-12">
            {/* CLEAN HEADER */}
            <div className="flex  justify-between items-start lg:items-center gap-3 md:gap-4">
                <div className="space-y-1 w-40">
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        Orders
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">{orders.length} orders in system</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openModal()}
                        className="h-10 px-5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-xs md:text-sm font-semibold flex items-center gap-2 active:scale-95"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Log Order</span>
                    </button>
                    <div className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col justify-center text-right">
                        <span className="text-[9px] font-semibold text-gray-400 uppercase">Total</span>
                        <span className="text-sm font-bold text-gray-900 leading-none -mt-0.5">{orders.length}</span>
                    </div>
                </div>
            </div>
            {/*-MONTH AND YEAR */}
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
            {/* STATS */}
            <div className="flex gap-3 md:gap-4">
                <StatBox title="Pending" value={orders.filter(o => o.status === 'Pending').length} icon={Clock} color="text-amber-500" />
                <StatBox title="Completed" value={orders.filter(o => o.status === 'Completed').length} icon={CheckCircle2} color="text-emerald-500" />
                <StatBox title="Revenue" value={`₦${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`} icon={Activity} color="text-gray-900" />
            </div>

            {/* ORDERS DISPLAY - HYBRID (Cards on Mobile, Table on Desktop) */}
            <div className="space-y-4">
                {/* MOBILE CARDS VIEW */}
                <div className="md:hidden space-y-3">
                    {orders.length > 0 ? orders.map(order => (
                        <div key={order._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">#{order._id.slice(-6).toUpperCase()}</p>
                                    <h4 className="text-sm font-bold text-gray-900">{order.customerName}</h4>
                                </div>
                                <button
                                    onClick={() => toggleStatus(order)}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${order.status === 'Completed'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}
                                >
                                    {order.status}
                                </button>
                            </div>

                            {order.clothDetails && (
                                <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded-lg">
                                    {order.clothDetails}
                                </p>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <p className="text-sm font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(order)}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 active:bg-black active:text-white transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 active:bg-red-500 active:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-sm text-gray-400">No orders yet</div>
                    )}
                </div>

                {/* DESKTOP TABLE VIEW */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {['Ref', 'Customer', 'Details', 'Valuation', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length > 0 ? orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-[10px] font-bold text-gray-400 italic">#{order._id.slice(-6).toUpperCase()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-600 line-clamp-1 max-w-[200px]">{order.clothDetails}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(order)}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${order.status === 'Completed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {order.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(order)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order._id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="p-12 text-center text-sm text-gray-400 italic">Financial ledger contains no order records.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative animate-fade-up">
                        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingOrder ? 'Edit Order' : 'New Order'}
                                </h3>
                            </div>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Customer Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white rounded-lg py-2.5 pl-10 pr-3 outline-none text-sm font-medium transition-all"
                                        value={newOrder.customerName}
                                        onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })}
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Amount (₦)</label>
                                <div className="relative">
                                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white rounded-lg py-2.5 pl-10 pr-3 outline-none text-sm font-medium transition-all"
                                        value={newOrder.totalAmount === 0 ? '' : newOrder.totalAmount}
                                        onChange={e => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Status</label>
                                <div className="relative">
                                    <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white rounded-lg py-2.5 pl-10 pr-10 outline-none text-sm font-medium appearance-none transition-all cursor-pointer"
                                        value={newOrder.status}
                                        onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
                                    >
                                        <option>Pending</option>
                                        <option>Completed</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Details</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white rounded-lg py-2.5 px-3 outline-none text-sm font-medium transition-all resize-none"
                                    value={newOrder.clothDetails}
                                    onChange={e => setNewOrder({ ...newOrder, clothDetails: e.target.value })}
                                    placeholder="Order details..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase hover:bg-gray-800 transition-all active:scale-95">
                                    {editingOrder ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatBox = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col gap-2">
            <div className={`${color} opacity-20`}>
                <Icon size={28} strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
        </div>
    </div>
);

export default OrderManager;
