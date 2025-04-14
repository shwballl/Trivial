import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Creator {
  id: number;
  name: string;
  email: string;
  rating: number;
  image: string | null;
  created_tasks: number;
  completed_tasks: number;
  about_me: string | null;
  socials: string | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  expires_at: string;
  category: string;
  price: string;
  creator: Creator;
}

// Category icons (reused from TaskList)
const categoryIcons = {
  design: (
    <svg className="w-6 h-6 mr-2 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  ),
  web: (
    <svg className="w-6 h-6 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 010-2h12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  text: (
    <svg className="w-6 h-6 mr-2 text-green-700" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  default: (
    <svg className="w-6 h-6 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h6.586a2 2 0 001.414-.586l4.414-4.414A2 2 0 0017 12.586V4a2 2 0 00-2-2H4z" />
    </svg>
  )
};

function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`http://127.0.0.1:8002/api/v1/tasks/${taskId}/`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // Handle different API response formats
        const taskData = data.task || data;
        setTask(taskData);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render rating stars
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

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!task) return <div className="text-center py-8">Task not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="flex items-center text-teal-600 hover:text-teal-800 mb-6">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Tasks
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                {categoryIcons[task.category as keyof typeof categoryIcons] || categoryIcons.default}
                <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Created: {formatDate(task.created_at)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">${task.price}</div>
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${task.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {task.is_completed ? 'Completed' : 'Active'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Task Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Deadline</h2>
            <div className="flex items-center text-red-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{formatDate(task.expires_at)}</span>
            </div>
          </div>

          {/* Creator info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Created By</h2>
            <div className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xl mr-4">
                {task.creator.image ? 
                  <img src={task.creator.image} alt={task.creator.name} className="h-12 w-12 rounded-full" /> : 
                  task.creator.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg">{task.creator.name}</div>
                <div className="text-gray-500 text-sm mb-2">{task.creator.email}</div>
                <div className="flex items-center">
                  {renderRating(task.creator.rating)}
                  <span className="ml-2 text-sm text-gray-500">({task.creator.rating})</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-4">Created tasks: {task.creator.created_tasks}</span>
                  <span>Completed tasks: {task.creator.completed_tasks}</span>
                </div>
                {task.creator.about_me && (
                  <div className="mt-2 text-sm text-gray-600">{task.creator.about_me}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <button className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {task.is_completed ? 'Task Completed' : 'Accept Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;