import React from 'react';
import { Link } from 'react-router-dom';

const HeaderComponent = () => {

  const isAuthenticated = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <header>
        <nav className='navbar navbar-dark bg-dark px-3'>

          {/* Left Side */}
          <Link to="/employees" className="navbar-brand">
            Employee Management System
          </Link>

          {/* Right Side */}
          <div>
            {isAuthenticated ? (
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-success">
                  Register
                </Link>
              </>
            )}
          </div>

        </nav>
      </header>
    </div>
  )
}

export default HeaderComponent;