import { useEffect, useState, useRef } from 'react';
import { TrendingUp, IndianRupee } from 'lucide-react';

const FlashingBalance = ({ balance }) => {
    const [highlight, setHighlight] = useState('');
    const prevBalance = useRef(balance);

    useEffect(() => {
        if (parseFloat(balance) > parseFloat(prevBalance.current)) {
            setHighlight('text-emerald-600 dark:text-emerald-400 scale-110');
        } else if (parseFloat(balance) < parseFloat(prevBalance.current)) {
            setHighlight('text-red-600 dark:text-red-400 scale-110');
        }

        if (balance !== prevBalance.current) {
            const timer = setTimeout(() => setHighlight(''), 1500);
            prevBalance.current = balance;
            return () => clearTimeout(timer);
        }
    }, [balance]);

    return (
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-darkborder transition-colors h-full">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Total Balance</h3>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-center">
                <IndianRupee className="w-8 h-8 text-gray-900 dark:text-zinc-100 mr-1" />
                <span className={`text-4xl font-bold transition-all duration-500 ${highlight || 'text-gray-900 dark:text-zinc-100'}`}>
                    {balance}
                </span>
            </div>
        </div>
    );
};

export default FlashingBalance;