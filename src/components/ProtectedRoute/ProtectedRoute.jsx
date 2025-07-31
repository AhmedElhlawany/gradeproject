import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

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

      try {
        // Validate JWT token by making a request to a protected endpoint
        await axios.get(`http://localhost:3000/api/users/${currentUser.id}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsLoggedIn(false);
        setShowAlert(true);
        // Clear localStorage on invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userEmail');
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
      });
    }
  }, [showAlert]);

  if (checking) {
    return <div className="text-center mt-5">Checking auth...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
}