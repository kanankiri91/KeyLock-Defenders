import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CekPasswordPage from './pages/CekPasswordPage';
import CekURLPage from './pages/CekURLPage';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import AboutPage from './pages/AboutPage';
import Login from './pages/LoginForm';
import Register from './pages/RegisterPage';
import AlertMe from './pages/AlertMe';
import AdminPage from './pages/adminPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const location = useLocation();

  return (
    <div>
      {(location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/admin' && location.pathname !== '/forgot-password') && (
        <NavbarComponent />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/beranda" element={<HomePage />} />
        <Route path="/password" element={<CekPasswordPage />} />
        <Route path="/url" element={<CekURLPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/alertme" element={<AlertMe />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profil" element={< ProfilePage/>} />
        <Route path="/forgot-password" element={< ForgotPassword/>} />
      </Routes>

      {(location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/admin' && location.pathname !== '/forgot-password') && (
        <FooterComponent />
      )}

      
    </div>
  );
}

export default App;
