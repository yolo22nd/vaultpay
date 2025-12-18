import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, Plus, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import FlashingBalance from '../components/FlashingBalance';
import ProfileCard from '../components/ProfileCard';
import TransferModal from '../components/TransferModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isTransferOpen, setTransferOpen] = useState(false);

    // 1. Fetch User Profile (Includes Decrypted Aadhaar)
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await api.get('users/profile/');
            return res.data;
        },
        refetchInterval: 3000 // Poll wallet balance
    });

    // 2. Fetch Transactions (Real-time polling)
    const { data: transactions, isLoading: txLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await api.get('wallet/history/');
            return res.data;
        },
        refetchInterval: 3000 // Poll for new money
    });

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (userLoading) return <div className="min-h-screen flex items-center justify-center">Loading Secure Vault...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">V</div>
                    <span className="text-xl font-bold text-gray-900">VaultPay</span>
                </div>
                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Top Section: Balance & Profile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FlashingBalance balance={user?.wallet_balance} />
                            
                            {/* Action Card */}
                            <div className="bg-primary rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-primary-100 font-medium">Quick Action</h3>
                                    <p className="text-2xl font-bold mt-1">Send Money</p>
                                </div>
                                <button 
                                    onClick={() => setTransferOpen(true)}
                                    className="mt-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 px-4 rounded-lg flex items-center justify-center transition-all border border-white/10"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> New Transfer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Card (Assignment 1) */}
                    <div className="md:col-span-1">
                        <ProfileCard user={user} />
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Transaction History</h3>
                        <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Real-time updates active
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Reference ID</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Counterparty</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {txLoading ? (
                                    <tr><td colSpan="5" className="p-4 text-center">Loading transactions...</td></tr>
                                ) : transactions?.results?.map((tx) => {
                                    const isDebit = tx.sender_email === user.email;
                                    return (
                                        <tr key={tx.reference_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                                                {tx.reference_id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center ${isDebit ? 'text-red-500' : 'text-green-500'}`}>
                                                    {isDebit ? <ArrowUpRight className="w-4 h-4 mr-1"/> : <ArrowDownLeft className="w-4 h-4 mr-1"/>}
                                                    {isDebit ? 'Sent' : 'Received'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">
                                                {isDebit ? tx.receiver_email : tx.sender_email}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${isDebit ? 'text-gray-900' : 'text-emerald-600'}`}>
                                                {isDebit ? '-' : '+'}₹{tx.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Empty State */}
                    {transactions?.results?.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No transactions yet. Start by sending money!
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <TransferModal 
                isOpen={isTransferOpen} 
                onClose={() => setTransferOpen(false)}
                userBalance={user?.wallet_balance}
            />
        </div>
    );
};

export default Dashboard;