import { useEffect, useState, useRef } from 'react';
import { TrendingUp, IndianRupee } from 'lucide-react';

const FlashingBalance = ({ balance }) => {
    const [highlight, setHighlight] = useState('');
    const prevBalance = useRef(balance);

    useEffect(() => {
        if (parseFloat(balance) > parseFloat(prevBalance.current)) {
            setHighlight('text-green-600 scale-110'); // Money came in
        } else if (parseFloat(balance) < parseFloat(prevBalance.current)) {
            setHighlight('text-red-600 scale-110'); // Money went out
        }

        if (balance !== prevBalance.current) {
            const timer = setTimeout(() => setHighlight(''), 1500); // Reset after 1.5s
            prevBalance.current = balance;
            return () => clearTimeout(timer);
        }
    }, [balance]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-center">
                <IndianRupee className="w-8 h-8 text-gray-900 mr-1" />
                <span className={`text-4xl font-bold transition-all duration-500 ${highlight || 'text-gray-900'}`}>
                    {balance}
                </span>
            </div>
        </div>
    );
};

export default FlashingBalance;