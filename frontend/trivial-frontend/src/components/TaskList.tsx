import { useState } from 'react';

const tasks = [
    {
        id: 1,
        category: 'Text',
        title: 'Text Writing',
        price: '$12/hr',
        deadline: '12/05/2023',
        description: 'A detailed text is needed about Radio-electronic circuits and something else, lol, kek...',
        skills: ['English', '1+ Year Experience'],
        author: 'Kuza N.',
        rating: '⭐⭐⭐⭐☆',
        iconColor: 'text-purple-700',
    },
    {
        id: 2,
        category: 'Websites',
        title: 'Website Development',
        price: '$9/hr',
        deadline: '12/05/2023',
        description: 'Need to build a site using React...',
        skills: ['HTML', 'CSS', 'React'],
        author: 'Alena T.',
        rating: '⭐⭐⭐⭐☆',
        iconColor: 'text-cyan-700',
    },
];

const categories = ['All Categories', 'Design', 'Websites', 'Text', 'Lab Work'];

function TaskList() {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const filteredTasks =
        selectedCategory === 'All Categories'
            ? tasks
            : tasks.filter(task => task.category === selectedCategory);

    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
            {/* Left Column — Filtered Tasks */}
            <div className="flex-1 space-y-4">
                {filteredTasks.length === 0 ? (
                    <p className="text-gray-500">No tasks found for "{selectedCategory}".</p>
                ) : (
                    <ul className="space-y-4">
                        {filteredTasks.map(task => (
                            <li key={task.id} className="border rounded-2xl p-4 shadow bg-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`${task.iconColor} font-semibold text-sm flex items-center`}>
                                        <svg className={`w-5 h-5 mr-1 ${task.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h6.586a2 2 0 001.414-.586l4.414-4.414A2 2 0 0017 12.586V4a2 2 0 00-2-2H4z" />
                                        </svg>
                                        {task.title}
                                    </span>
                                    <span className="text-sm font-semibold">{task.price}</span>
                                </div>
                                <div className="text-gray-600 text-sm mb-1">Deadline: {task.deadline}</div>
                                <p className="text-gray-800 mb-2">{task.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {task.skills.map((skill, i) => (
                                        <span key={i} className="bg-gray-100 px-2 py-1 text-xs rounded border">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-sm text-right text-gray-500 mt-2">
                                    {task.author} {task.rating}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Right Column — Filters */}
            <div className="w-full md:w-64">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((category, index) => (
                        <li
                            key={index}
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
