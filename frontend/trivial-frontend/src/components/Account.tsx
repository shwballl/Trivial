import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    rating: number;
    created_tasks: number;
    completed_tasks: number;
    about_me: string | null;
    socials: string | null;
    image: string | null;
}

function Account() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8002/api/v1/auth/user/', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const renderRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return <div className="flex">{stars}</div>;
    };

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
    );

    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!user) return <div className="text-center py-8">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gray-50 p-6 border-b">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-3xl">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="h-24 w-24 rounded-full" />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center justify-center sm:justify-start mt-2">
                                {renderRating(user.rating)}
                                <span className="ml-2 text-sm text-gray-500">({user.rating})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stats */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created Tasks:</span>
                                    <span className="font-medium">{user.created_tasks}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Completed Tasks:</span>
                                    <span className="font-medium">{user.completed_tasks}</span>
                                </div>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">About Me</h2>
                            <p className="text-gray-700">
                                {user.about_me || 'No information provided'}
                            </p>
                        </div>

                        {/* Social Links */}
                        {user.socials && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Social Links</h2>
                                <div className="flex space-x-4">
                                    {user.socials.split(',').map((social, index) => (
                                        <a 
                                            key={index} 
                                            href={social.trim()} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {social.trim()}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex space-x-4">
                        <Link 
                            to="/me/tasks" 
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                        >
                            My Tasks
                        </Link>
                        <Link 
                            to="/create-task" 
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            Create New Task
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;