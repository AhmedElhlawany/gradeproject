import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import styles from './Login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setapiError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    // password: Yup.string()
    //   .matches(
    //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
    //     'Password is not valid'
    //   )
    //   .required('Password is required'),
  });

  const handleLogin = async (formValues) => {
    setIsLoading(true);
    setapiError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
      const user = userCredential.user;
      const token = await user.getIdToken(); // Optional: if you want to send to backend
      console.log('Login successful, token:', token);

      // Navigate to home page
      navigate('/');
    } catch (error) {
      setapiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className={`${styles['login']} d-flex justify-content-center align-items-center vh-100`}>
      <div className="login-form w-50 mx-auto my-5">
        <h1 className="text-center mb-5">Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3 w-100">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              type="email"
              name="email"
              className={`${styles['form-control']} form-control`}
              id="logemail"
              placeholder="name@example.com"
            />
            <label htmlFor="logemail">Email address</label>
            {formik.errors.email && formik.touched.email && (
              <div className="alert alert-danger mt-2">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-floating mt-3">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              name="password"
              className={`${styles['form-control']} form-control`}
              id="logpassword"
              placeholder="Password"
            />
            <label htmlFor="logpassword">Password</label>
            {formik.errors.password && formik.touched.password && (
              <div className="alert alert-danger mt-2">{formik.errors.password}</div>
            )}
          </div>

          {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

          <button disabled={isLoading} type="submit" className="btn btn-danger w-100 mt-4">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={`${styles['login']}  mt-3`}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
