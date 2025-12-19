import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

const ProfileCard = ({ user }) => {
    const [showAadhaar, setShowAadhaar] = useState(false);

    // Pulse animation uses Zinc in dark mode now
    if (!user) return <div className="animate-pulse h-32 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>;

    const aadhaar = user.aadhaar_number || "Not Set";
    const displayAadhaar = showAadhaar 
        ? aadhaar 
        : (aadhaar === "Not Set" ? "XXXX-XXXX-XXXX" : `XXXX-XXXX-${aadhaar.slice(-4)}`);

    return (
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-darkborder h-full transition-colors">
            <div className="flex items-center space-x-4 mb-6">
                {/* Avatar: Primary Navy in Light, White in Dark (High Contrast) */}
                <div className="w-12 h-12 bg-primary dark:bg-zinc-100 dark:text-black rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {(user.first_name?.[0] || 'U')}{(user.last_name?.[0] || 'N')}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100">{user.first_name} {user.last_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{user.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Inner Box: Slate in Light, Deep Black (Zinc 950) in Dark */}
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-100 dark:border-darkborder">
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1 flex items-center">
                        <Shield className="w-3 h-3 mr-1 text-primary dark:text-zinc-400" /> Secure Aadhaar ID
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-mono font-medium text-gray-800 dark:text-zinc-200">
                            {displayAadhaar}
                        </span>
                        <button 
                            onClick={() => setShowAadhaar(!showAadhaar)}
                            className="text-primary dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                        >
                            {showAadhaar ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-zinc-500">Phone Status</span>
                    {/* Badge: Kept Green but adjusted border/opacity for dark mode */}
                    <span className="px-2 py-1 bg-green-100 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 rounded-full text-xs font-medium border border-transparent dark:border-emerald-900/30">Verified</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;