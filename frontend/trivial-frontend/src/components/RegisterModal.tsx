import { useState } from "react";

type RegisterModalProps = {
  onClose: () => void;
};

function RegisterModal({ onClose }: RegisterModalProps) {
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно добавить реальную логику отправки
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-[90%] max-w-md flex">
        {/* Левая часть с изображением */}
        <div
          className="hidden sm:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=500&q=60')",
          }}
        ></div>

        {/* Правая часть */}
        <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center items-center space-y-4">
          {success ? (
            <>
              <h2 className="text-xl font-semibold text-center text-green-600">
                Success!
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
              <form onSubmit={handleRegister} className="w-full space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Repeat password"
                  required
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-900 transition"
                >
                  Continue
                </button>
              </form>
              <div className="text-gray-400 text-sm">или</div>
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
