

import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../HotelPayment/HotelPayment.module.css';
import StepsBar from '../../UI/StepsBar/StepsBar';

export default function BookingForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const hotel = state?.hotel;
  const selectedRooms = state?.selectedRooms;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  if (!hotel || !selectedRooms) {
    return (
      <div className="container py-5 text-center">
        <h3>Hotel or room data not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  if (!currentUser || !token) {
    return (
      <div className="container py-5 text-center">
        <h3>Please log in to book a hotel</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0]; 

  const formik = useFormik({
    initialValues: {
      firstName: currentUser.name?.split(' ')[0] || '',
      lastName: currentUser.name?.split(' ')[1] || '',
      phone: currentUser.phone || '',
      email: currentUser.email || '',
      checkIn: '',
      checkOut: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      phone: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      checkIn: Yup.date()
        .min(today, 'Check-in date cannot be in the past')
        .required('Check-in date is required'),
      checkOut: Yup.date()
        .min(Yup.ref('checkIn'), 'Check-out must be after check-in')
        .required('Check-out date is required'),
    }),
    onSubmit: (values) => {
      navigate('/hotellpayment', {
        state: { hotel, selectedRooms, userDetails: values },
      });
    },
  });

  const totalCost = selectedRooms.reduce(
    (sum, room) => sum + room.price * room.count,
    0
  );

  return (
    <div className="container mt-4 py-5">
      <StepsBar currentStep={2} />
      <h2 className="mb-4 pt-3">Enter Your Booking Details for {hotel.name}</h2>
      <div className="mb-4">
        <h4>Selected Rooms</h4>
        {selectedRooms.map((room, index) => (
          <p key={index}>
            {room.type}: {room.count} room(s) at ${room.price} each
          </p>
        ))}
        <h5>Total Cost: ${totalCost.toFixed(2)}</h5>
      </div>
      <form onSubmit={formik.handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            id="firstName"
            className="form-control"
            {...formik.getFieldProps('firstName')}
            aria-required="true"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-danger">{formik.errors.firstName}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            id="lastName"
            className="form-control"
            {...formik.getFieldProps('lastName')}
            aria-required="true"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-danger">{formik.errors.lastName}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            className="form-control"
            {...formik.getFieldProps('phone')}
            aria-required="true"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-danger">{formik.errors.phone}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            {...formik.getFieldProps('email')}
            aria-required="true"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="checkIn" className="form-label">
            Check-In Date
          </label>
          <input
            id="checkIn"
            type="date"
            className="form-control"
            {...formik.getFieldProps('checkIn')}
            min={today}
          />
          {formik.touched.checkIn && formik.errors.checkIn && (
            <div className="text-danger">{formik.errors.checkIn}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="checkOut" className="form-label">
            Check-Out Date
          </label>
          <input
            id="checkOut"
            type="date"
            className="form-control"
            {...formik.getFieldProps('checkOut')}
            min={formik.values.checkIn || today}
          />
          {formik.touched.checkOut && formik.errors.checkOut && (
            <div className="text-danger">{formik.errors.checkOut}</div>
          )}
        </div>

        <div className="col-12">
          <button className={`btn ${styles['btn-hpay']}`} type="submit">
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}