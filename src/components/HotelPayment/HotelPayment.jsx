


import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './HotelPayment.module.css';
import StepsBar from '../../UI/StepsBar/StepsBar';

export default function HotelPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const hotel = state?.hotel;
  const selectedRooms = state?.selectedRooms;
  const userDetails = state?.userDetails;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  const importantDates = [
    { date: '2025-12-24', reason: 'Christmas Eve' },
    { date: '2025-12-25', reason: 'Christmas Day' },
    { date: '2025-12-31', reason: "New Year's Eve" },
    { date: '2026-01-01', reason: "New Year's Day" },
    { date: '2025-02-14', reason: "Valentine's Day" },
  ];

  if (!hotel || !selectedRooms || !userDetails) {
    return (
      <div className="container py-5 text-center">
        <h3>Booking data not found</h3>
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

  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .matches(/^\d{16}$/, 'Card number must be 16 digits')
        .required('Required'),
      expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)')
        .required('Required'),
      cvv: Yup.string()
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      let totalCost = selectedRooms.reduce(
    (sum, room) => sum + room.price * room.count * numberOfNights,
        0
      );

      const checkInDate = new Date(userDetails.checkIn).toISOString().split('T')[0];
      const specialDate = importantDates.find((d) => d.date === checkInDate);
      const isSpecialDate = !!specialDate;
      if (isSpecialDate) {
        totalCost *= 0.9; 
      }

      const newBookingId = uuidv4();
      const bookingData = {
        bookingId: newBookingId,
        hotelId: hotel.id,
        hotelName: hotel.name,
        city: hotel.city,
        rooms: selectedRooms.map((room) => ({
          type: room.type,
          count: room.count,
          price: room.price,
        })),
        totalCost  ,
        fullName: `${userDetails.firstName} ${userDetails.lastName}`,
        phone: userDetails.phone,
        email: userDetails.email,
        bookingDate: new Date().toISOString(),
        checkIn: userDetails.checkIn,
        checkOut: userDetails.checkOut,
        discountApplied: isSpecialDate ? `10% ${specialDate.reason} discount` : 'None',
      };

      try {
        for (const room of selectedRooms) {
          const response = await axios.post(
            `http://localhost:3000/api/hotels/${hotel.id}/book`,
            {
              roomType: room.type,
              quantity: room.count,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(response.data.error || 'Booking failed on server');
          }
        }

        const bookingResponse = await axios.post(
          `http://localhost:3000/api/users/${currentUser.id}/hotel-bookings`,
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (bookingResponse.status !== 200) {
          throw new Error(bookingResponse.data.error || 'Failed to save hotel booking');
        }

        setBookingId(newBookingId);
        setIsConfirmed(true);
        await Swal.fire({
          title: 'Success!',
          text: `Your booking at ${hotel.name} for $${totalCost.toFixed(2)}${isSpecialDate ? ` (10% ${specialDate.reason} discount applied)` : ''} has been confirmed!`,
          icon: 'success',
          confirmButtonText: 'OK',
           customClass: {
                                    confirmButton: `btn ${styles['conbtn']}`,
                                  }
        });
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        await Swal.fire({
          title: 'Error!',
          text: `Booking failed: ${errorMessage}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },
  });

  const handleCancelBooking = async () => {
    if (!bookingId) {
      await Swal.fire({
        title: 'Error!',
        text: 'No booking to cancel',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/${currentUser.id}/cancel-hotel-booking`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Failed to cancel booking');
      }

      setIsConfirmed(false);
      setBookingId(null);
      await Swal.fire({
        title: 'Success!',
        text: 'Booking cancelled successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/hotels');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      await Swal.fire({
        title: 'Error!',
        text: `Cancel booking failed: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const checkIn = new Date(userDetails.checkIn).getTime();
const checkOut = new Date(userDetails.checkOut).getTime();
const numberOfNights = Number((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const totalCost = selectedRooms.reduce(
    (sum, room) => sum + room.price * room.count * numberOfNights,
    0
  );
  const checkInDate = userDetails.checkIn
    ? new Date(userDetails.checkIn).toISOString().split('T')[0]
    : '';
  const specialDate = importantDates.find((d) => d.date === checkInDate);
  const isSpecialDate = !!specialDate;
  const displayTotal = isSpecialDate ? totalCost * 0.9  : totalCost ;
  
 


  return (
    <div className="container mt-4 py-5">
      <StepsBar currentStep={3} /> 
      {isConfirmed ? (
        <div className="text-center">
          <h2>Booking Confirmed!</h2>
          <p>
            Your booking at {hotel.name} for ${displayTotal.toFixed(2)}
            {isSpecialDate ? ` (10% ${specialDate.reason} discount applied)` : ''} has been
            confirmed.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => navigate('/hotels')}>
              Back to Hotels
            </button>
            <button className="btn btn-danger" onClick={handleCancelBooking}>
              Cancel Booking
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`container  ${styles['payment-container']}`}>
            <h2 className="mb-4 pt-3">Payment for {hotel.name}</h2>
          <h4>Booking Details</h4>
          <div className="mb-4 row">
            
            <div className="col-md-6">
              <p>
              <strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}
            </p>
            </div>
              <div className="col-md-6">
                <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
              </div>
              <div className="col-md-6"> <p>
              <strong>Phone:</strong> {userDetails.phone}
            </p></div>
              <div className="col-md-6"> <p>
              <strong>Check-In:</strong> {new Date(userDetails.checkIn).toLocaleDateString()}
            </p></div>
              
              <div className="col-md-6">
                 <h4>Selected Rooms</h4>
            {selectedRooms.map((room, index) => (
              <p key={index}>
                {room.type}: {room.count} room(s) at ${room.price} each
              </p>
            ))}
              </div>
              <div className="col-md-6"> <p>
              <strong>Check-Out:</strong>{' '}
              {new Date(userDetails.checkOut).toLocaleDateString()}
            </p></div>
              <div className="col-md-6"> <h5>
<h5>
    Total Cost: ${displayTotal .toFixed(2)}
    {isSpecialDate ? ` (10% ${specialDate.reason} discount)` : ''}
  </h5>
              {isSpecialDate ? ` (10% ${specialDate.reason} discount)` : ''}
            </h5></div>
              
        
          </div>

          <form onSubmit={formik.handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <input
                id="cardNumber"
                className="form-control"
                maxLength={16}
                {...formik.getFieldProps('cardNumber')}
                aria-required="true"
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div className="text-danger">{formik.errors.cardNumber}</div>
              )}
            </div>

            <div className="col-md-3">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                className="form-control"
                placeholder="MM/YY"
                {...formik.getFieldProps('expiryDate')}
                aria-required="true"
              />
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <div className="text-danger">{formik.errors.expiryDate}</div>
              )}
            </div>

            <div className="col-md-3">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                id="cvv"
                className="form-control"
                {...formik.getFieldProps('cvv')}
                aria-required="true"
              />
              {formik.touched.cvv && formik.errors.cvv && (
                <div className="text-danger">{formik.errors.cvv}</div>
              )}
            </div>

            <div className="col-12">
              <button className={`btn ${styles['btn-hpay']}`} type="submit">
                Confirm Payment
              </button>
            </div>
          </form>
          </div>
        </>
      )}
    </div>
  );
}