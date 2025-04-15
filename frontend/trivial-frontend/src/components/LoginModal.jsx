import { useState } from 'react';

function LoginModal({ onClose, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8002/api/v1/auth/login/', {
                method: 'POST',
                credentials: 'include', // Important for cookies
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.status || 'Login failed');
            }

            // Success - JWT is automatically stored in cookies
            onLoginSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-[90%] max-w-md flex">
                {/* Left side with background */}
                <div className="hidden sm:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=500&q=60')" }}></div>

                {/* Right side with form */}
                <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center items-center space-y-4">
                    <h2 className="text-xl font-semibold text-center">Login</h2>
                    
                    {error && (
                        <div className="w-full p-2 bg-red-100 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none" 
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none" 
                            required
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-gray-400 text-sm">or</div>
                    <button className="w-full border border-gray-300 rounded-full py-2 font-semibold hover:bg-gray-100 transition">
                        Google
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-sm text-gray-400 hover:text-black mt-4"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;