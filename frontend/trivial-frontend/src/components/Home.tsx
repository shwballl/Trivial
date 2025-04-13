import TaskList from "./TaskList";

function Home() {
    return (
        <>
        <div className="flex flex-col lg:flex-row items-center  min-h-screen bg-white py-4 px-4">
            {/* Левая часть (форма поиска) */}
            <div className="flex flex-col items-start lg:w-1/2 mb-6 ml-40 lg:mb-0 space-y-4">
                <h1 className="text-4xl font-bold text-gray-800">Find a Task</h1>
                <div className="flex items-center border border-gray-300 rounded-lg w-full">
                    <input 
                        type="text" 
                        placeholder="Search by keywords" 
                        className="py-2 px-4 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-gray-800 text-white px-6 py-2 rounded-r-lg hover:bg-gray-700">
                        Search
                    </button>
                </div>
                <p className="text-lg text-gray-600">
                    Want to create a task? <a href="/create-task" className="text-blue-500 hover:text-blue-700">Create a Task</a>
                </p>
            </div>

            {/* Правая часть (изображение) */}
            <div className="lg:w-1/2 flex justify-center px-4 mr-32">
                <img className="w-3/4 rounded-lg shadow-lg" src="/image.png" alt="Task Illustration" />
            </div>
        </div>
            <TaskList />
</>
);
}

export default Home;
