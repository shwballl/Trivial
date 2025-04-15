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
}

const categories = ['all', 'design', 'web', 'text', 'video', 'image', 'programming', 'other'];

// Icons for different categories
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

function TaskList() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch('http://127.0.0.1:8002/api/v1/tasks/')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const tasksArray = Array.isArray(data) ? data : data.data || data.results || [];
                if (!Array.isArray(tasksArray)) throw new Error('Expected an array of tasks');
                setTasks(tasksArray);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, []);

    // Format deadline date
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

    // Display rating with stars
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

    const filteredTasks = (selectedCategory === 'all' ? tasks : tasks.filter(task => task.category === selectedCategory)) || [];

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
                {filteredTasks.length === 0 ? (
                    <p className="text-gray-500">No tasks found in the "{selectedCategory}" category</p>
                ) : (
                    <ul className="space-y-4">
                        {filteredTasks.map(task => (
                            <li key={task.id} className="border rounded-2xl p-4 shadow bg-white hover:shadow-md transition-shadow">
                                <Link to={`/tasks/${task.id}`} className="block">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-purple-700 font-semibold text-sm flex items-center">
                                            {categoryIcons[task.category as keyof typeof categoryIcons] || categoryIcons.default}
                                            {task.title}
                                        </span>
                                        <span className="text-sm font-semibold">{task.price} $</span>
                                    </div>
                                    <div className="text-gray-600 text-sm mb-1">
                                        Deadline: {formatDeadline(task.expires_at)}
                                    </div>
                                    <p className="text-gray-800 mb-2">{task.description}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-500 mr-2">{task.creator.name}</span>
                                        <div className="flex items-center">
                                            {renderRating(task.creator.rating)}
                                            <span className="ml-1 text-xs text-gray-500">({task.creator.rating})</span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Right column - Filters */}
            <div className="w-full md:w-64">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex items-center gap-2 cursor-pointer font-medium ${
                                selectedCategory === category
                                    ? 'text-teal-700'
                                    : 'text-gray-600 hover:text-teal-500'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TaskList;