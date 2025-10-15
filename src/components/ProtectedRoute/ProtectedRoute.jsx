import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Style from './ProtectedRoute.module.css'

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!token || !currentUser) {
        setIsLoggedIn(false);
        setShowAlert(true);
        setChecking(false);
        return;
      }

      if(token || currentUser) {
        setIsLoggedIn(true);
      }

     
      setChecking(false);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        icon: 'warning',
        title: 'You should login first',
        confirmButtonText: 'Ok',
         customClass: {
                  confirmButton: `btn ${Style['conbtn']}`,
                }
      });
    }
  }, [showAlert]);

  if (checking) {
    return <div className="text-center mt-5">Checking auth...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
}