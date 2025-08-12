import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './Profile.module.css';



export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user profile data from backend on component mount
    const fetchUserProfile = async () => {
      if (!user || !token) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${user.id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 && response.data.profilePhoto) {
          const updatedUser = { ...user, profilePhoto: response.data.profilePhoto };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [user?.id, token]);

  if (!user || !token) {
    return <p>No user is logged in.</p>;
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=43f73617e06ead79c1ca94038e1e2862', 
        formData
      );

      if (response.status === 200 && response.data.data.url) {
        const imageUrl = response.data.data.url;

        try {
          const updateResponse = await axios.put(
            `http://localhost:3000/api/users/${user.id}/profile`,
            { profilePhoto: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (updateResponse.status !== 200) {
            throw new Error('Failed to update profile photo in backend');
          }
        } catch (error) {
          console.error('Error updating backend:', error);
          await Swal.fire({
            title: 'Warning!',
            text: 'Profile photo uploaded but failed to update in backend. It may not persist after logout.',
            icon: 'warning',
            confirmButtonText: 'OK',
             customClass: {
                      confirmButton: `btn ${styles['conbtn']}`,
                    }
          });
        }

        const updatedUser = { ...user, profilePhoto: imageUrl };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);

        await Swal.fire({
          title: 'Success!',
          text: 'Profile photo uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
           customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to upload profile photo.',
        icon: 'error',
        confirmButtonText: 'OK',
         customClass: {
                  confirmButton: `btn ${styles['conbtn']}`,
                }
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits')
      .required('Phone is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/users/${user.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const updatedUser = { ...user, ...values };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setUser(updatedUser);
          setShowEditModal(false);
          await Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
             customClass: {
                      confirmButton: `btn ${styles['conbtn']}`,
                    }
          });
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        await Swal.fire({
          title: 'Error!',
          text: error.response?.data?.error || 'Failed to update profile',
          icon: 'error',
          confirmButtonText: 'OK',
           customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
        });
      }
    },
  });

  const handleImageClick = () => {
    if (user.profilePhoto) {
      setShowPhotoModal(true);
    }
  };

  return (
    <div className="profile pt-5">
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Welcome, {user.name}</h2>
            <div className="mb-4 position-relative" style={{ width: '150px', height: '150px' }}>
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    cursor: user.profilePhoto ? 'pointer' : 'default' 
                  }}
                  onClick={handleImageClick}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '150px', height: '150px' }}
                >
                  <span className="text-white">No Photo</span>
                </div>
              )}
              <div
                className="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  display: isUploading ? 'none' : 'block',
                }}
                onClick={triggerFileInput}
                title="Upload profile photo"
              >
                <i className="fa-solid fa-camera text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="d-none"
                ref={fileInputRef}
                id="profilePhotoInput"
              />
              {isUploading && (
                <div
                  className="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-75 rounded p-2"
                  style={{ zIndex: 10 }}
                >
                  Uploading...
                </div>
              )}
            </div>
             <h4>General Information</h4>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <button
              className={`btn mb-3 ${styles['editbtn']}`}
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>
          
          </div>

<div className="col-md-6">
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <NavLink
        to="/myBookings"
        className={({ isActive }) =>
          "nav-link fw-bold" + (isActive ? " active" : "")
        }
      >
        Booked Flights
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink
        to="/bookedHotels"
        className={({ isActive }) =>
          "nav-link fw-bold" + (isActive ? " active" : "")
        }
      >
        Booked Hotels
      </NavLink>
    </li>
  </ul>
</div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className={`modal fade ${showEditModal ? 'show' : ''} `}
        style={{ display: showEditModal ? 'block' : 'none' , marginTop: '70px' }}
        tabIndex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden={!showEditModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    disabled
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-danger">{formik.errors.phone}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button type="submit" className={`btn ${styles['savebtn']}`} disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showEditModal && <div className="modal-backdrop fade show"></div>}

      {/* Photo Enlargement Modal */}
      <div
        className={`modal fade ${showPhotoModal ? 'show' : ''}`}
        style={{ display: showPhotoModal ? 'block' : 'none' ,marginTop:'50px'}}
        tabIndex="-1"
        aria-labelledby="photoModalLabel"
        aria-hidden={!showPhotoModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
             
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPhotoModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <img
                src={user.profilePhoto}
                alt="Profile Large"
                className="img-fluid"
                style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPhotoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPhotoModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
