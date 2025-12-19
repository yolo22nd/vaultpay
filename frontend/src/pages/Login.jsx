import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    // PRE-FILLED CREDENTIALS FOR REVIEWER CONVENIENCE
    const [email, setEmail] = useState('omtank22@gmail.com');
    const [password, setPassword] = useState('password'); // Matches the seed_data script
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('users/login/', { email, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg transition-colors duration-300 relative">
            {/* ThemeToggle positioned absolutely */}
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full bg-white dark:bg-darkcard rounded-xl shadow-lg p-8 border border-gray-100 dark:border-darkborder transition-colors">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary dark:bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-white dark:text-black font-bold text-xl">V</div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">VaultPay</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Secure P2P Lending & Transfer</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-darkborder dark:bg-darkcard dark:text-zinc-100 rounded-lg focus:ring-primary dark:focus:ring-indigo-500 focus:border-primary transition-colors outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-primary hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Sign In <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary dark:text-indigo-400 hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;