import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <ToastContainer />
            <Routes>
                <Route path="/" exact element={<MainPage />} />
                <Route path="/auth/register" exact element={<RegisterPage />} />
                <Route path="/auth/login" exact element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;
