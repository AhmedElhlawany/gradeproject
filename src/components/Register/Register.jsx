import React, { useState } from 'react';
import style from './Register.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register() {
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 chars').max(40, 'Max 40 chars').required('Name is required'),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Phone must be Egyptian').required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password not strong enough')
      .required('Password is required'),
    rePassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Re-enter password'),
  });

  const handleRegister = async (values) => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });

      // Store the JWT token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: response.data.user.id,
        name: response.data.user.name,
        phone: response.data.user.phone,
        email: response.data.user.email,
      }));

      await Swal.fire({
        title: 'Success!',
        text: 'Registration successful!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setApiError(errorMessage);
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      rePassword: '',
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className={`${style['register']} d-flex justify-content-center align-items-center `}>
      <div className="register-form w-50 mx-auto my-5">
        <h1 className="text-center mb-5">Register</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              id="regName"
              className={`form-control ${style['form-control']}`}
              placeholder="User Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            <label htmlFor="regName">User Name</label>
            {formik.errors.name && formik.touched.name && (
              <div className="alert alert-danger mt-1">{formik.errors.name}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="tel"
              name="phone"
              id="regPhone"
              className={`form-control ${style['form-control']}`}
              placeholder="Phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            <label htmlFor="regPhone">Phone</label>
            {formik.errors.phone && formik.touched.phone && (
              <div className="alert alert-danger mt-1">{formik.errors.phone}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              id="regEmail"
              className={`form-control ${style['form-control']}`}
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <label htmlFor="regEmail">Email</label>
            {formik.errors.email && formik.touched.email && (
              <div className="alert alert-danger mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              id="regPassword"
              className={`form-control ${style['form-control']}`}
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <label htmlFor="regPassword">Password</label>
            {formik.errors.password && formik.touched.password && (
              <div className="alert alert-danger mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="rePassword"
              id="regRePassword"
              className={`form-control ${style['form-control']}`}
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
            />
            <label htmlFor="regRePassword">Confirm Password</label>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <div className="alert alert-danger mt-1">{formik.errors.rePassword}</div>
            )}
          </div>

          {apiError && <div className="alert alert-danger">{apiError}</div>}

          <button type="submit" className={`btn w-100 mt-4 ${style['register-btn']}`} disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}