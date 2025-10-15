

import React, { useEffect, useState } from 'react';
import style from './Navbar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track auth state based on localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    setUser(currentUser && token ? currentUser : null);
    console.log("current user" , user);
    
  }, []);

  // Logout handler
  const handleLogout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`${style['navbar']} navbar navbar-expand-lg`}>
      <div className="container">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" className={style.logoImg} />
          <NavLink className={`navbar-brand fs-1 fw-bolder ${style.logo}`} to="/">Fly High</NavLink>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {(JSON.parse(localStorage.getItem('currentUser'))?.email === 'ahmedelhalawany429@gmail.com'
              ? [{ to: '/dashboard', label: 'Dashboard' }]
              : [
                  { to: '/', label: 'Home' },
                  { to: '/flights', label: 'Flights' },
                  { to: '/hotels', label: 'Hotels' },
                ]
            ).map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${style['nav-link']} text-dark p-2 mx-2 fs-5 ${isActive ? style['active-link'] : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="navbar-nav ms-auto">
            {JSON.parse(localStorage.getItem('currentUser')) ? (
              JSON.parse(localStorage.getItem('currentUser')).email === 'ahmedelhalawany429@gmail.com' ? (
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className={`${style['nav-link']} text-dark p-2 mx-2 fs-5 btn`}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/favorite"
                      className={({ isActive }) =>
                        `${style['nav-link']} d-flex align-items-center pt-3 text-dark p-2 mx-2 fs-5 ${
                          isActive ? style['active-link'] : ''
                        }`
                      }
                    >
                      <i className={`fa-solid fa-heart ${style['profile-icon']}`}></i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `${style['nav-link']} d-flex align-items-center pt-3 text-dark p-2 mx-2 fs-5 ${
                          isActive ? style['active-link'] : ''
                        }`
                      }
                    >
                      <i className={`fa-solid fa-user ${style['profile-icon']}`}></i>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className={`${style['nav-link']} text-dark p-2 mx-2 fs-5 btn`}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${style['nav-link']} text-dark p-2 mx-2 fs-5 ${isActive ? style['active-link'] : ''}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `${style['nav-link']} text-dark p-2 mx-2 fs-5 ${isActive ? style['active-link'] : ''}`
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}