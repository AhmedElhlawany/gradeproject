import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Notfound.module.css';

export default function Notfound() {
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPage(true);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPage ? (
        <div className={`d-flex flex-column justify-content-center align-items-center vh-100 ${styles.notfoundBg}`}>
          <h1 className={`display-1 fw-bold ${styles.bounce} ${styles.primaryText}`}>404</h1>
          <p className="h3 fw-semibold mb-3">Oops! Page Not Found</p>
          <p className={`text-center mb-4 px-3 ${styles.infoText}`} style={{ maxWidth: '500px' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className={`btn ${styles.customBtn} px-4 py-2 fw-bold shadow`}>
            Go Home
          </Link>
          <div className="position-absolute bottom-0 text-secondary small pb-3">
            © {new Date().getFullYear()} Fly High
          </div>
        </div>
      ) : (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light text-info">
          <h3>Not Found Page...</h3>
        </div>
      )}
    </>
  );
}
