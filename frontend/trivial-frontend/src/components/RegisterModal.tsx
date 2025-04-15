import { useState } from "react";

type RegisterModalProps = {
  onClose: () => void;
  onRegisterSuccess: () => void;
};

function RegisterModal({ onClose, onRegisterSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8002/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      onRegisterSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-[90%] max-w-md flex">
        {/* Left side with image */}
        <div
          className="hidden sm:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=500&q=60')",
          }}
        ></div>

        {/* Right side */}
        <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center items-center space-y-4">
          {success ? (
            <>
              <h2 className="text-xl font-semibold text-center text-green-600">
                Success! Please verify your email
              </h2>
              <button
                onClick={onClose}
                className="mt-4 bg-black text-white rounded-full py-2 px-6 hover:bg-gray-900 transition"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-center">Sign Up</h2>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <form onSubmit={handleRegister} className="w-full space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Continue'}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;