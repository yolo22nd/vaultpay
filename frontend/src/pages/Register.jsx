import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Lock, Phone, FileText, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        aadhaar_number: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.aadhaar_number.length < 12) {
            setError("Aadhaar number must be at least 12 digits.");
            setLoading(false);
            return;
        }

        try {
            await api.post('users/register/', formData);
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.email?.[0] || 
                        err.response?.data?.aadhaar_number?.[0] || 
                        "Registration failed. Please check your details.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            
            <div className="max-w-md w-full bg-white dark:bg-darkcard rounded-xl shadow-lg p-8 border border-gray-100 dark:border-darkborder transition-colors">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary dark:bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-white dark:text-black font-bold">V</div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">Create Account</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Join VaultPay Secure Network</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                            <input
                                name="first_name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                            <input
                                name="last_name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                placeholder="you@example.com"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aadhaar Number (National ID)</label>
                        <div className="relative mt-1">
                            <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                name="aadhaar_number"
                                type="text"
                                required
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                placeholder="XXXX-XXXX-XXXX"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                name="phone_number"
                                type="tel"
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                placeholder="+91 98765 43210"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 py-3 px-4 rounded-lg flex items-center justify-center transition-all border border-indigo-100 text-indigo-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Create Account <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-700 dark:text-indigo-400 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;