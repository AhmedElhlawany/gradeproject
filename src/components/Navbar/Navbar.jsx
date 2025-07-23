import React, { useEffect, useState } from 'react';
import style from './Navbar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout handler
 const handleLogout = async () => {
  try {
    await signOut(auth);

    // امسح بيانات المستخدم من localStorage
    localStorage.removeItem('currentUser');

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
            {[
              { to: '/', label: 'Home' },
              { to: '/flights', label: 'Flights' },
              { to: '/hotels', label: 'Hotels' },
              // { to: '/myflights', label: 'My Flight' },
              // { to: '/favourite', label: 'Favourite' },
            ].map(({ to, label }) => (
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
            {user ? (
              <>
 <li className="nav-item">
                <NavLink
                  to="/favorite"
                  className={({ isActive }) =>
                    `${style['nav-link']} d-flex align-items-center pt-3 text-dark p-2 mx-2 fs-5 ${isActive ? style['active-link'] : ''}`
                  }
                >
                  <i className={`fa-solid fa-heart ${style['profile-icon']}`}></i>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${style['nav-link']} d-flex align-items-center pt-3 text-dark p-2 mx-2 fs-5 ${isActive ? style['active-link'] : ''}`
                  }
                >
                  <i className={`fa-regular fa-user ${style['profile-icon']}`}></i>
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className={`${style['nav-link']} text-dark p-2 mx-2 fs-5 btn `}
                >
                  Logout
                </button>
              </li>
              </>
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
