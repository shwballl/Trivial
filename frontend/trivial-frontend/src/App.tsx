import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";
import CreateTask from "./components/CreateTask";
import MyTasksList from "./components/MyTasksList";
import Account from "./components/Account";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8002/api/v1/auth/user/', {
          credentials: 'include'
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8002/api/v1/auth/logout/', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <>
        <Header
          isAuthenticated={isAuthenticated}
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
          onLogoutClick={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          
          {/* Protected routes */}
          <Route 
            path="/create-task" 
            element={isAuthenticated ? <CreateTask /> : <Navigate to="/" />} 
          />
          <Route 
            path="/me/tasks" 
            element={isAuthenticated ? <MyTasksList /> : <Navigate to="/" />} 
          />
          <Route 
            path="/me" 
            element={isAuthenticated ? <Account /> : <Navigate to="/" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {isLoginOpen && (
          <LoginModal 
            onClose={() => setIsLoginOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {isRegisterOpen && (
          <RegisterModal 
            onClose={() => setIsRegisterOpen(false)}
            onRegisterSuccess={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
          />
        )}
      </>
    </BrowserRouter>
  );
}

export default App;