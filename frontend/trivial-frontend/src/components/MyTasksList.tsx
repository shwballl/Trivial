import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Creator {
    name: string;
    rating: number;
}

interface Task {
    id: number;
    title: string;
    category: string;
    price: string;
    expires_at: string;
    description: string;
    creator: Creator;
    is_completed: boolean;
}

const categoryIcons = {
    design: (
        <svg className="w-5 h-5 mr-1 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
    ),
    web: (
        <svg className="w-5 h-5 mr-1 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 010-2h12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
    ),
    text: (
        <svg className="w-5 h-5 mr-1 text-green-700" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
    ),
    default: (
        <svg className="w-5 h-5 mr-1 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h6.586a2 2 0 001.414-.586l4.414-4.414A2 2 0 0017 12.586V4a2 2 0 00-2-2H4z" />
        </svg>
    )
};

function MyTaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://127.0.0.1:8002/api/v1/me/tasks/', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setTasks(data.tasks || []);
            } catch (err) {
                console.error('Error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const formatDeadline = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
            
            <div className="grid gap-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        You haven't created any tasks yet
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className={`border rounded-2xl p-4 shadow ${task.is_completed ? 'bg-gray-50' : 'bg-white'} hover:shadow-md transition-shadow`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    {categoryIcons[task.category as keyof typeof categoryIcons] || categoryIcons.default}
                                    <Link to={`/tasks/${task.id}`} className="font-semibold hover:underline">
                                        {task.title}
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-semibold">{task.price} $</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${task.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {task.is_completed ? 'Completed' : 'Active'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-gray-600 text-sm mb-1">
                                Deadline: {formatDeadline(task.expires_at)}
                            </div>
                            <p className="text-gray-800 mb-2 line-clamp-2">{task.description}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm text-gray-500 mr-2">Creator: {task.creator.name}</span>
                                <div className="flex items-center">
                                    {renderRating(task.creator.rating)}
                                    <span className="ml-1 text-xs text-gray-500">({task.creator.rating})</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyTaskList;