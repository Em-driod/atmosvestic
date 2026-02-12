import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../constants';

const AdminLogin = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid password');
                setPassword('');
            }
        } catch (err) {
            setError('Server error. Could not connect to the mothership.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 selection:bg-black selection:text-white">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center animate-fade-up">
                    <div className="inline-block p-4 bg-black text-white rounded-lg mb-6">
                        <Lock size={20} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Portal</h1>
                    <p className="text-xs text-gray-400 font-medium mb-6 uppercase tracking-wider">Access Mission Control</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block px-1">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium outline-none focus:border-black transition-all"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-200"
                        >
                            {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </form>
                </div>
                <p className="text-center text-[10px] font-bold text-gray-400 mt-8 uppercase tracking-[0.2em]">
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;