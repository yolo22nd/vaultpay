import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import FlashingBalance from '../components/FlashingBalance';
import ProfileCard from '../components/ProfileCard';
import TransferModal from '../components/TransferModal';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isTransferOpen, setTransferOpen] = useState(false);

    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await api.get('users/profile/');
            return res.data;
        },
        refetchInterval: 3000
    });

    const { data: transactions, isLoading: txLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await api.get('wallet/history/');
            return res.data;
        },
        refetchInterval: 3000
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (userLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-darkbg dark:text-zinc-100">Loading Secure Vault...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkbg transition-colors duration-300">
            {/* Navbar */}
            <nav className="bg-white dark:bg-darkcard border-b border-gray-200 dark:border-darkborder px-6 py-4 flex justify-between items-center transition-colors">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-black font-bold">V</div>
                    <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">VaultPay</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={handleLogout} className="flex items-center text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-1 h-full">
                        <div className="h-full">
                            <FlashingBalance balance={user?.wallet_balance} />
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="md:col-span-1 h-full">
                        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-gray-900 dark:text-white shadow-lg flex flex-col justify-between h-full transition-colors border border-gray-100 dark:border-darkborder">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-300 font-medium">Quick Action</h3>
                                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">Send Money</p>
                            </div>
                            <button 
                                onClick={() => setTransferOpen(true)}
                                className="mt-4 bg-indigo-50 hover:bg-indigo-100 py-3 px-4 rounded-lg flex items-center justify-center transition-all border border-indigo-100 text-indigo-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                            >
                                <Plus className="w-5 h-5 mr-2" /> New Transfer
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-1 h-full">
                        <ProfileCard user={user} />
                    </div>
                </div>

                {/* Transaction History - Formal Table */}
                <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-darkborder overflow-hidden transition-colors">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-darkborder flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-zinc-100">Transaction History</h3>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Real-time updates active
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-zinc-500 uppercase bg-gray-50 dark:bg-zinc-900/50">
                                <tr>
                                    <th className="px-6 py-3">Reference ID</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Counterparty</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-darkborder">
                                {txLoading ? (
                                    <tr><td colSpan="5" className="p-4 text-center dark:text-zinc-500">Loading transactions...</td></tr>
                                ) : transactions?.results?.map((tx) => {
                                    const isDebit = tx.sender_email === user.email;
                                    return (
                                        <tr key={tx.reference_id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-500 dark:text-zinc-500 text-xs">
                                                {tx.reference_id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center ${isDebit ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    {isDebit ? <ArrowUpRight className="w-4 h-4 mr-1"/> : <ArrowDownLeft className="w-4 h-4 mr-1"/>}
                                                    {isDebit ? 'Sent' : 'Received'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-zinc-200 font-medium">
                                                {isDebit ? tx.receiver_email : tx.sender_email}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${isDebit ? 'text-gray-900 dark:text-zinc-100' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {isDebit ? '-' : '+'}₹{tx.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-green-100 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 rounded-full text-xs font-medium border border-transparent dark:border-emerald-900/30">
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {transactions?.results?.length === 0 && (
                        <div className="p-10 text-center text-gray-500 dark:text-zinc-500">
                            No transactions yet.
                        </div>
                    )}
                </div>
            </main>

            <TransferModal 
                isOpen={isTransferOpen} 
                onClose={() => setTransferOpen(false)}
                userBalance={user?.wallet_balance}
            />
        </div>
    );
};

export default Dashboard;