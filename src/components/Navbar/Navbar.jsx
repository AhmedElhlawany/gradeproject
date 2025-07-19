import React, { useEffect, useState } from 'react';
import style from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../../assets/logo.png'
export default function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if logged out
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className={`${style['navbar']} navbar navbar-expand-lg`}>
        <div className="container">
         <div className="d-flex ">
           <img src={logo} alt="" />
          <Link className={` navbar-brand  fs-1 fw-bolder ${style['logo']}`} to="/">Fly High</Link>
         </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item ">
                <Link className={`${style['nav-link']} text-dark p-2 mx-2 fs-5`} to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`${style['nav-link']}  text-dark p-2 mx-2 fs-5`} to="flights">Flights</Link>
              </li>
              <li className="nav-item">
                <Link className={`${style['nav-link']}  text-dark p-2 mx-2 fs-5`} to="hotels">Hotels</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link text-dark p-2 mx-2 fs-5" to="places">Places</Link>
              </li> */}
              <li className="nav-item">
                <Link className={`${style['nav-link']} text-dark p-2 mx-2 fs-5`} to="myflights">My Flights</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fs-5" to="favourite">Favourite</Link>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <button onClick={handleLogout} className={`${style['outbtn']}  text-dark p-2 mx-2 fs-5`}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={`${style['nav-link']} text-dark p-2 mx-2 fs-5`} to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`${style['nav-link']} text-dark p-2 mx-2 fs-5`} to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
