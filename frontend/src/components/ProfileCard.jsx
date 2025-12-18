import { useState } from 'react';
import { Shield, Eye, EyeOff, User } from 'lucide-react';

const ProfileCard = ({ user }) => {
    const [showAadhaar, setShowAadhaar] = useState(false);

    // Safety Check: If user is loading or null
    if (!user) return <div className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>;

    // Safety Check: Handle missing Aadhaar number to prevent crash
    const aadhaar = user.aadhaar_number || "Not Set";
    
    // Logic to show masked version (Last 4 digits or XXXX)
    const displayAadhaar = showAadhaar 
        ? aadhaar 
        : (aadhaar === "Not Set" ? "XXXX-XXXX-XXXX" : `XXXX-XXXX-${aadhaar.slice(-4)}`);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {/* Safety Check: Handle missing names */}
                    {(user.first_name?.[0] || 'U')}{(user.last_name?.[0] || 'N')}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                        <Shield className="w-3 h-3 mr-1" /> Secure Aadhaar ID
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-mono font-medium text-gray-800">
                            {displayAadhaar}
                        </span>
                        <button 
                            onClick={() => setShowAadhaar(!showAadhaar)}
                            className="text-primary hover:text-slate-700 transition-colors"
                        >
                            {showAadhaar ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Phone Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;