import { useState } from "react";
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

  return (
    <BrowserRouter>
      <>
        <Header
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<TaskList />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/me/tasks" element={<MyTasksList />} />
          <Route path="me" element={<Account />} />
        </Routes>
        
        {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
        {isRegisterOpen && <RegisterModal onClose={() => setIsRegisterOpen(false)} />}
      </>
    </BrowserRouter>
  );
}

export default App;