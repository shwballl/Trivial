import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskData {
  title: string;
  description: string;
  category: string;
  price: string;
  expires_at: string;
}

const CreateTask = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    category: '',
    price: '',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default: 7 days from now
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category: string) => {
    setTaskData(prev => ({
      ...prev,
      category
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setTaskData(prev => ({
      ...prev,
      expires_at: date.toISOString()
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!taskData.title.trim()) {
          setError('Please enter a title');
          return false;
        }
        break;
      case 2:
        if (!taskData.category.trim()) {
          setError('Please select a category');
          return false;
        }
        break;
      case 3:
        if (!taskData.description.trim()) {
          setError('Please enter a description');
          return false;
        }
        if (!taskData.price.trim() || isNaN(Number(taskData.price))) {
          setError('Please enter a valid price');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8002/api/v1/me/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskData,
          price: String(taskData.price) // Ensure price is sent as string
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const data = await response.json();
      navigate(`/tasks/${data.id}`); // Redirect to the created task
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Создать задание</h1>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${step === stepNumber ? 'bg-teal-600 text-white' : 
                     step > stepNumber ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`h-1 w-8 ${step > stepNumber ? 'bg-green-100' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Как назвать задание?</h2>
              <p className="text-gray-500 text-sm mb-4">Введите название</p>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
                placeholder="Название задания"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Выберите категорию</h2>
              <p className="text-gray-500 text-sm mb-4">Категория</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {['web', 'design', 'text', 'programming'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-full text-sm 
                      ${taskData.category === cat ? 
                        'bg-teal-600 text-white' : 
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {cat}
                    {taskData.category === cat && (
                      <span className="ml-1">×</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">Описание задания</h2>
                <p className="text-gray-500 text-sm mb-2">Введите подробное описание</p>
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleInputChange}
                  placeholder="Описание задания"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">Цена</h2>
                <p className="text-gray-500 text-sm mb-2">Укажите сумму вознаграждения</p>
                <input
                  type="number"
                  name="price"
                  value={taskData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">Срок выполнения</h2>
                <p className="text-gray-500 text-sm mb-2">Укажите дату и время завершения</p>
                <input
                  type="datetime-local"
                  value={formatDateForInput(taskData.expires_at)}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Проверьте информацию</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Название:</span> {taskData.title}</p>
                  <p><span className="text-gray-500">Категория:</span> {taskData.category}</p>
                  <p><span className="text-gray-500">Цена:</span> {taskData.price}</p>
                  <p><span className="text-gray-500">Срок:</span> {new Date(taskData.expires_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-between">
          <button
            onClick={handleBack}
            className="py-2 px-4 text-gray-600 hover:text-gray-800 font-medium"
          >
            Назад
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </>
              ) : 'Создать задание'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;