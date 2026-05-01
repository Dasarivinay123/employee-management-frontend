import './App.css'
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HeaderComponent from './components/HeaderComponent'
import ListEmployeeComponent from './components/ListEmployeeComponent'
import FooterComponent from './components/FooterComponent'
import EmployeeComponent from './components/EmployeeComponent'
import LoginComponent from './components/LoginComponent'
import RegisterComponent from './components/RegisterComponent'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

function App() {

  // ✅ State-based auth (FIX)
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const updateAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  };

  return (
    <BrowserRouter>
      <HeaderComponent />

      <Routes>

        {/* 🔓 Public Routes */}
        <Route
          path='/login'
          element={
            isAuth
              ? <Navigate to="/employees" />
              : <LoginComponent updateAuth={updateAuth} />
          }
        />

        <Route
          path='/register'
          element={
            isAuth
              ? <Navigate to="/employees" />
              : <RegisterComponent />
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔐 Protected Routes */}
        <Route
          path='/'
          element={
            isAuth
              ? <ListEmployeeComponent />
              : <Navigate to="/login" />
          }
        />

        <Route
          path='/employees'
          element={
            isAuth
              ? <ListEmployeeComponent />
              : <Navigate to="/login" />
          }
        />

        <Route
          path='/add-employee'
          element={
            isAuth
              ? <EmployeeComponent />
              : <Navigate to="/login" />
          }
        />

        <Route
          path='/edit-employee/:id'
          element={
            isAuth
              ? <EmployeeComponent />
              : <Navigate to="/login" />
          }
        />

        {/* 🔁 fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

      <FooterComponent />
    </BrowserRouter>
  )
}

export default App;