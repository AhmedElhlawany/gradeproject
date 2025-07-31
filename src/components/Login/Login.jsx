// // import React, { useState } from 'react';
// // import * as Yup from 'yup';
// // import { useFormik } from 'formik';
// // import styles from './Login.module.css';
// // import { useNavigate, Link } from 'react-router-dom';
// // import {  signInWithEmailAndPassword } from 'firebase/auth';
// // import { signInWithPopup } from "firebase/auth";
// // import { auth, provider } from "../../firebase";

// // export default function Login() {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [apiError, setapiError] = useState('');
// //   const navigate = useNavigate();
// //   // const auth = getAuth();
// // const loginWithGoogle = async () => {
// //   try {
// //     const result = await signInWithPopup(auth, provider);
// //     const user = result.user;

// //     // جلب كل المستخدمين المسجلين في اللوكال (لو فيه)
// //     const users = JSON.parse(localStorage.getItem("users")) || [];

// //     // شوف لو المستخدم ده موجود بالفعل
// //     let existingUser = users.find(u => u.email === user.email);

// //     // لو مش موجود، ضيفه لقائمة المستخدمين
// //     if (!existingUser) {
// //       existingUser = {
// //         email: user.email,
// //         name: user.displayName,
// //         photo: user.photoURL,
// //         uid: user.uid,
// //       };
// //       users.push(existingUser);
// //       localStorage.setItem("users", JSON.stringify(users));
// //     }

// //     // احفظ المستخدم الحالي
// //     localStorage.setItem("currentUser", JSON.stringify(existingUser));
// //     localStorage.setItem("userEmail", existingUser.email);

// //     // التوجيه لصفحة الهوم
// //     navigate("/");

// //   } catch (error) {
// //     console.error("Google sign-in error:", error);
// //   }
// // };

// //   const validationSchema = Yup.object({
// //   email: Yup.string().email('Email is invalid').required('Email is required'),
// //   password: Yup.string()
// //     .matches(
// //       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
// //       'Password is not valid'
// //     )
// //     .required('Password is required'),
// // });

// // const handleLogin = async (formValues) => {
// //   setIsLoading(true);
// //   setapiError('');
// //   try {
// //     const userCredential = await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
// //     const token = await userCredential.user.getIdToken();
// //       const user = userCredential.user;

// //     const users = JSON.parse(localStorage.getItem('users')) || [];
// //     const currentUser = users.find(user => user.email === formValues.email);

// //     if (currentUser) {
// //       localStorage.setItem('currentUser', JSON.stringify(currentUser));
// //     }
// // await fetch("http://localhost:3000/api/users", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ email: user.email }),
// //       });

// //       // إعادة توجيه لصفحة الـ dashboard أو الـ home
     
   

// //     navigate('/');
// //     localStorage.setItem("userEmail", currentUser.email);

// //   } catch (error) {
// //     setapiError('Invalid email or password');
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };


// //   const formik = useFormik({
// //     initialValues: {
// //       email: '',
// //       password: '',
// //     },
// //     validationSchema: validationSchema,
// //     onSubmit: handleLogin,
// //   });

// //   return (
// //     <div className={`${styles['login']} d-flex justify-content-center align-items-center vh-100`}>
// //       <div className="login-form w-50 mx-auto my-5">
// //         <h1 className="text-center mb-5">Login</h1>
// //         <form onSubmit={formik.handleSubmit}>
// //           <div className="form-floating mb-3 w-100">
// //             <input
// //               onBlur={formik.handleBlur}
// //               onChange={formik.handleChange}
// //               value={formik.values.email}
// //               type="email"
// //               name="email"
// //               className={`${styles['form-control']} form-control`}
// //               id="logemail"
// //               placeholder="name@example.com"
// //             />
// //             <label htmlFor="logemail">Email address</label>
// //             {formik.errors.email && formik.touched.email && (
// //               <div className="alert alert-danger mt-2">{formik.errors.email}</div>
// //             )}
// //           </div>

// //           <div className="form-floating mt-3">
// //             <input
// //               onBlur={formik.handleBlur}
// //               onChange={formik.handleChange}
// //               value={formik.values.password}
// //               type="password"
// //               name="password"
// //               className={`${styles['form-control']} form-control`}
// //               id="logpassword"
// //               placeholder="Password"
// //             />
// //             <label htmlFor="logpassword">Password</label>
// //             {formik.errors.password && formik.touched.password && (
// //               <div className="alert alert-danger mt-2">{formik.errors.password}</div>
// //             )}
// //           </div>

// //           {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

// //           <button disabled={isLoading} type="submit" className={`${styles['login-btn']}  btn w-100 mt-4`}>
// //             {isLoading ? 'Logging in...' : 'Login'}
// //           </button>
// //         </form>
// //         <p className={`${styles['login']}  mt-3`}>
// //           Don&apos;t have an account? <Link to="/register">Register</Link>
// //         </p>
// //               <button onClick={loginWithGoogle} className={`${styles['loginG-btn']}  btn w-100 mt-4`}>Sign in with Google <i className="fa-brands fa-google"></i></button>

// //       </div>

// //     </div>
// //   );
// // }


// import React, { useState } from 'react';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import styles from './Login.module.css';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { auth } from '../../firebase';

// export default function Login() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState('');
//   const navigate = useNavigate();
//   const provider = new GoogleAuthProvider();

//   const validationSchema = Yup.object({
//     email: Yup.string().email('Email is invalid').required('Email is required'),
//     password: Yup.string()
//       .matches(
//         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
//         'Password is not valid'
//       )
//       .required('Password is required'),
//   });

//   const handleLogin = async (formValues) => {
//     setIsLoading(true);
//     setApiError('');
//     try {
//       const response = await axios.post('http://localhost:3000/api/login', {
//         email: formValues.email,
//         password: formValues.password,
//       });

//       // Store JWT token and user data in localStorage
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('currentUser', JSON.stringify({
//         id: response.data.user.id,
//         email: response.data.user.email,
//         name: response.data.user.name,
//         phone: response.data.user.phone,
//       }));
//       localStorage.setItem('userEmail', response.data.user.email);

//       navigate('/');
//     } catch (error) {
//       setApiError(error.response?.data?.error || 'Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // Send Google user data to backend for registration/login
//       const response = await axios.post('http://localhost:3000/api/google-login', {
//         email: user.email,
//         name: user.displayName || 'Google User',
//         phone: user.phoneNumber || '', // Google may not provide phone number
//       });

//       // Store JWT token and user data in localStorage
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('currentUser', JSON.stringify({
//         id: response.data.user.id,
//         email: response.data.user.email,
//         name: response.data.user.name,
//         phone: response.data.user.phone,
//       }));
//       localStorage.setItem('userEmail', response.data.user.email);

//       navigate('/');
//     } catch (error) {
//       console.error('Google sign-in error:', error);
//       setApiError(error.response?.data?.error || 'Google sign-in failed');
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: validationSchema,
//     onSubmit: handleLogin,
//   });

//   return (
//     <div className={`${styles['login']} d-flex justify-content-center align-items-center vh-100`}>
//       <div className="login-form w-50 mx-auto my-5">
//         <h1 className="text-center mb-5">Login</h1>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="form-floating mb-3 w-100">
//             <input
//               onBlur={formik.handleBlur}
//               onChange={formik.handleChange}
//               value={formik.values.email}
//               type="email"
//               name="email"
//               className={`${styles['form-control']} form-control`}
//               id="logemail"
//               placeholder="name@example.com"
//             />
//             <label htmlFor="logemail">Email address</label>
//             {formik.errors.email && formik.touched.email && (
//               <div className="alert alert-danger mt-2">{formik.errors.email}</div>
//             )}
//           </div>

//           <div className="form-floating mt-3">
//             <input
//               onBlur={formik.handleBlur}
//               onChange={formik.handleChange}
//               value={formik.values.password}
//               type="password"
//               name="password"
//               className={`${styles['form-control']} form-control`}
//               id="logpassword"
//               placeholder="Password"
//             />
//             <label htmlFor="logpassword">Password</label>
//             {formik.errors.password && formik.touched.password && (
//               <div className="alert alert-danger mt-2">{formik.errors.password}</div>
//             )}
//           </div>

//           {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}

//           <button disabled={isLoading} type="submit" className={`${styles['login-btn']} btn w-100 mt-4`}>
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//         <p className={`${styles['login']} mt-3`}>
//           Don&apos;t have an account? <Link to="/register">Register</Link>
//         </p>
//         <button onClick={loginWithGoogle} className={`${styles['loginG-btn']} btn w-100 mt-4`}>
//           Sign in with Google <i className="fa-brands fa-google"></i>
//         </button>
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import styles from './Login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const validationSchema = Yup.object({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Password is not valid'
      )
      .required('Password is required'),
  });

  const handleLogin = async (formValues) => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: formValues.email,
        password: formValues.password,
      });

      // Store JWT token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        phone: response.data.user.phone,
      }));
      localStorage.setItem('userEmail', response.data.user.email);

      navigate('/');
    } catch (error) {
      setApiError(error.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send Google user data to backend for registration/login
      const response = await axios.post('http://localhost:3000/api/google-login', {
        email: user.email,
        name: user.displayName || 'Google User',
        phone: user.phoneNumber || '', // Google may not provide phone number
      });

      // Store JWT token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        phone: response.data.user.phone,
      }));
      localStorage.setItem('userId', response.data.user.id);

      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setApiError(error.response?.data?.error || 'Google sign-in failed');
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

          <button disabled={isLoading} type="submit" className={`${styles['login-btn']} btn w-100 mt-4`}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={`${styles['login']} mt-3`}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        <button onClick={loginWithGoogle} className={`${styles['loginG-btn']} btn w-100 mt-4`}>
          Sign in with Google <i className="fa-brands fa-google"></i>
        </button>
      </div>
    </div>
  );
}