
//////////////////////


import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../Context/FlightContext';
import styles from './Payment.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51Rs2cRRvs8RNfuxBeaGlV9t806Y1OOs1Blk5nPFYzcKgpWMzscfQaFeK3ppOVe4REDkoWY1rYsNfqq2JUDYgI3uz00go56Lvc1'); // Replace with pk_test_... or use process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

const Payment = () => {
  const { selectedFlight, adults, child } = useContext(FlightContext);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null); // Store bFId for cancellation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!currentUser || !token) {
      setError('Please login to book a flight.');
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login to book a flight.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      setLoading(false);
      return;
    }

    if (!selectedFlight?.id) {
      setError('Invalid flight data.');
      Swal.fire({
        icon: 'error',
        title: 'Invalid Flight',
        text: 'Invalid flight data.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe not loaded.');
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'Stripe not loaded.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      setLoading(false);
      return;
    }

    try {
      const newBFId = uuidv4();

      // Create PaymentIntent
      const response = await axios.post(
        `https://flyhigh.zeabur.app/api/create-flight-payment-intent`,
        { flightId: selectedFlight.id, adults, children: child },
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
            name: currentUser.name,
            email: currentUser.email,
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

        setBookingId(newBFId); // Store bFId for cancellation
        setIsPaymentConfirmed(true);
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed',
          text: 'Your flight has been booked successfully.',
          confirmButtonText: 'Ok',
          customClass: { confirmButton: `btn ${styles['conbtn']}` },
        });
      }
    } catch (err) {
      console.error('Error booking flight:', err);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.message,
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!currentUser || !token || !bookingId) {
      setError('No booking to cancel or not logged in.');
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: 'No booking to cancel or not logged in.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      return;
    }

    try {
      const response = await axios.post(
        `https://flyhigh.zeabur.app/api/users/${currentUser.id}/cancel-booking`,
        { bFId: bookingId },
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

      setIsPaymentConfirmed(false);
      setBookingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Booking Cancelled',
        text: 'Your flight booking has been cancelled successfully.',
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
      navigate('/flights');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.error || err.message);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: err.response?.data?.error || err.message,
        confirmButtonText: 'Ok',
        customClass: { confirmButton: `btn ${styles['conbtn']}` },
      });
    }
  };

  const handleBackToFlights = () => navigate('/flights');

  if (!currentUser || !token) {
    return (
      <div className="container text-center mt-5" style={{ paddingTop: '70px' }}>
        <h3>Please log in to book a flight</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!selectedFlight) {
    return (
      <div className="container text-center mt-5" style={{ paddingTop: '70px' }}>
        <h3>No flight selected</h3>
        <p>Please go back and select a flight first.</p>
        <button className={`btn  mt-3 ${styles['conbtn']}`} onClick={handleBackToFlights}>
          Back to Flights
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ paddingTop: '70px' }}>
      <h2 className="mb-4 text-center fw-bold">Complete Your Flight Booking</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {isPaymentConfirmed ? (
                <div className="text-center">
                  <h3 className="card-title mb-3 fw-semibold text-success">
                    Booking Confirmed Successfully!
                  </h3>
                  <p className="text-muted">
                    Your flight from {selectedFlight.from} to {selectedFlight.to} on{' '}
                    {selectedFlight.date} has been booked.
                  </p>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                      className={`btn  px-4 ${styles['backbtn']}`} 
                      onClick={handleBackToFlights}
                    >
                      Back to Flights
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
                  <h3 className="card-title mb-4 fw-semibold">Flight Summary</h3>
                  <div className="mb-4 p-3 bg-light rounded">
                    <p className="mb-2">
                      <strong>From:</strong> {selectedFlight.from}
                    </p>
                    <p className="mb-2">
                      <strong>To:</strong> {selectedFlight.to}
                    </p>
                    <p className="mb-2">
                      <strong>Date:</strong> {selectedFlight.date}
                    </p>
                    <p className="mb-2">
                      <strong>Airline:</strong> {selectedFlight.airline}
                    </p>
                    <p className="mb-0">
                      <strong>Total Price:</strong> ${selectedFlight.price * (adults + (child * 0.5))}
                    </p>
                  </div>

                  <h3 className="card-title mb-4 fw-semibold">Payment Information</h3>
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
                      className={`btn  w-100 py-2 ${styles['conbtn']}`}
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
const WrappedPayment = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default WrappedPayment;