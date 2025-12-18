import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import api from '../api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TransferModal = ({ isOpen, onClose, userBalance }) => {
    const [receiverEmail, setReceiverEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    // The Mutation Logic (Optimistic Updates)
    const transferMutation = useMutation({
        mutationFn: async (data) => {
            // GENERATE IDEMPOTENCY KEY (The "Extra Mile")
            const idemKey = uuidv4(); 
            return api.post('wallet/transfer/', { 
                ...data, 
                idempotency_key: idemKey 
            });
        },
        onSuccess: () => {
            // Force a re-fetch of balance and history immediately
            queryClient.invalidateQueries(['wallet']);
            queryClient.invalidateQueries(['transactions']);
            onClose();
            setAmount('');
            setReceiverEmail('');
        },
        onError: (err) => {
            setError(err.response?.data?.error || "Transfer failed. Please check details.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (parseFloat(amount) > parseFloat(userBalance)) {
            setError("Insufficient funds in wallet.");
            return;
        }
        transferMutation.mutate({ receiver_email: receiverEmail, amount: parseFloat(amount) });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Send Money</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="friend@example.com"
                            value={receiverEmail}
                            onChange={(e) => setReceiverEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={transferMutation.isPending}
                            className="w-full bg-primary hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center disabled:opacity-50"
                        >
                            {transferMutation.isPending ? 'Processing...' : (
                                <>Pay Securely <Send className="w-4 h-4 ml-2" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferModal;