import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import ToolBar from './components/ToolBar';
import ImagePage from './pages/ImagePage';

function App() {
    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <ToastContainer />
            <ToolBar />
            <Routes>
                <Route path="/" exact element={<MainPage />} />
                <Route path="/auth/register" exact element={<RegisterPage />} />
                <Route path="/auth/login" exact element={<LoginPage />} />
                <Route path="/images/:imageId" exact element={<ImagePage />} />
            </Routes>
        </div>
    );
}

export default App;
