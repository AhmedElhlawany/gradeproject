

///////////////////



import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './HotelPayment.module.css';
import StepsBar from '../../UI/StepsBar/StepsBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Rs2cRRvs8RNfuxBeaGlV9t806Y1OOs1Blk5nPFYzcKgpWMzscfQaFeK3ppOVe4REDkoWY1rYsNfqq2JUDYgI3uz00go56Lvc1'); // Replace with pk_test_...

const HotelPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

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
  const displayTotal = isSpecialDate ? totalCost * 0.9 : totalCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe not loaded.');
      Swal.fire({
        title: 'Error!',
        text: 'Stripe not loaded.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      setLoading(false);
      return;
    }

    try {
      const newBookingId = uuidv4();

      // Create PaymentIntent
      const response = await axios.post(
        `https://flyhigh.zeabur.app/api/create-hotel-payment-intent`,
        {
          hotelId: hotel.id,
          rooms: selectedRooms.map((room) => ({
            type: room.type,
            count: room.count,
          })),
          totalCost: displayTotal,
          checkIn: userDetails.checkIn,
          checkOut: userDetails.checkOut,
          discountApplied: isSpecialDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Failed to create payment intent');
      }

      const { clientSecret } = response.data;

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: userDetails.email,
            phone: userDetails.phone,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm booking
        const confirmResponse = await axios.post(
          `https://flyhigh.zeabur.app/api/confirm-payment`,
          { paymentIntentId: paymentIntent.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (confirmResponse.status !== 200) {
          throw new Error(confirmResponse.data.error || 'Failed to confirm booking');
        }

        setBookingId(newBookingId);
        setIsConfirmed(true);
        await Swal.fire({
          title: 'Success!',
          text: `Your booking at ${hotel.name} for $${displayTotal.toFixed(2)}${isSpecialDate ? ` (10% ${specialDate.reason} discount applied)` : ''} has been confirmed!`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: { confirmButton: `btn ${styles['conbtn']}` },
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
      await Swal.fire({
        title: 'Error!',
        text: `Booking failed: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) {
      await Swal.fire({
        title: 'Error!',
        text: 'No booking to cancel',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      return;
    }

    try {
      const response = await axios.post(
        `https://flyhigh.zeabur.app/api/users/${currentUser.id}/cancel-hotel-booking`,
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
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      navigate('/hotels');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      await Swal.fire({
        title: 'Error!',
        text: `Cancel booking failed: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
    }
  };

  return (
    <div className="container mt-4 py-5">
      <StepsBar currentStep={3} />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {isConfirmed ? (
                <div className="text-center">
                  <h3 className="card-title mb-3 fw-semibold text-success">
                    Booking Confirmed!
                  </h3>
                  <p className="text-muted">
                    Your booking at {hotel.name} for ${displayTotal.toFixed(2)}
                    {isSpecialDate ? ` (10% ${specialDate.reason} discount applied)` : ''} has been
                    confirmed.
                  </p>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                      className={`btn px-4  ${styles['backbtn']}`}
                      onClick={() => navigate('/hotels')}
                    >
                      Back to Hotels
                    </button>
                    <button
                      className="btn btn-outline-danger px-4"
                      onClick={handleCancelBooking}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="card-title mb-4 fw-bold">Payment for {hotel.name}</h3>
                  <h4 className="fw-semibold mb-3">Booking Details</h4>
                  <div className="mb-4 p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Name:</strong> {userDetails.firstName} {userDetails.lastName}
                        </p>
                        <p className="mb-2">
                          <strong>Email:</strong> {userDetails.email}
                        </p>
                        <p className="mb-2">
                          <strong>Phone:</strong> {userDetails.phone}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Check-In:</strong> {new Date(userDetails.checkIn).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                          <strong>Check-Out:</strong> {new Date(userDetails.checkOut).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                          <strong>Nights:</strong> {numberOfNights}
                        </p>
                      </div>
                    </div>
                    <h5 className="mt-3 mb-2">Selected Rooms</h5>
                    {selectedRooms.map((room, index) => (
                      <p key={index} className="mb-1">
                        {room.type}: {room.count} room(s) at ${room.price} each
                      </p>
                    ))}
                    <p className="mt-3 mb-0">
                      <strong>Total Cost:</strong> ${displayTotal.toFixed(2)}
                      {isSpecialDate ? ` (10% ${specialDate.reason} discount)` : ''}
                    </p>
                  </div>

                  <h4 className="fw-semibold mb-3">Payment Information</h4>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Card Details</label>
                      <div className="border rounded p-2">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#212529',
                                '::placeholder': { color: '#6c757d' },
                                padding: '10px',
                              },
                              invalid: { color: '#dc3545' },
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">Powered by Stripe</small>
                      <img
                        src="https://logos-world.net/wp-content/uploads/2022/12/Stripe-Emblem.png"
                        alt="Stripe"
                        style={{ height: '20px' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`btn w-100 py-2  ${styles['conbtn']}`}
                      disabled={!stripe || loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      {loading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap in Elements provider
const WrappedHotelPayment = () => (
  <Elements stripe={stripePromise}>
    <HotelPayment />
  </Elements>
);

export default WrappedHotelPayment;