import React, { useEffect, useState } from 'react';
import styles from './MyBookings.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BookedFlights() {
  const [bookedFlights, setBookedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || !token) {
      setLoading(false);
      return;
    }

    // Fetch booked flights from API
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://flyhigh.zeabur.app/api/users/${currentUser.id}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setBookedFlights(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booked flights:', err);
        setError(err.response?.data?.error || 'Failed to load booked flights. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, token]);

const cancelBooking = async (bFId) => {
  if (!currentUser || !token) {
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: 'You must be logged in to cancel a booking.',
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: `btn ${styles['conbtn']}`,
      },
    });
    return;
  }

  try {
    console.log('bFId:', bFId); // Debug: Log the bFId value
    if (!bFId || typeof bFId !== 'string' || bFId.trim() === '') {
      throw new Error('Invalid bFId: Must be a non-empty string');
    }

    const response = await axios.post(
      `https://flyhigh.zeabur.app/api/users/${currentUser.id}/cancel-booking`,
      { bFId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      setBookedFlights((prev) => prev.filter((f) => f.bFId !== bFId));
      Swal.fire({
        icon: 'success',
        title: 'Booking Cancelled',
        text: 'Your flight booking has been cancelled successfully.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: `btn ${styles['conbtn']}`,
        },
      });
    }
  } catch (error) {
    console.error('Cancellation failed:', error);
    const errorMessage = error.message === 'Invalid bFId: Must be a non-empty string'
      ? 'The booking ID is invalid. Please try again.'
      : error.response?.data?.error || 'An unexpected error occurred. Please try again.';
    Swal.fire({
      icon: 'error',
      title: 'Cancellation Failed',
      text: errorMessage,
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: `btn ${styles['conbtn']}`,
      },
    });
  }
};

  if (!currentUser || !token) {
    return (
      <div className="container mt-5 pt-5">
        <h2 className="mb-4">Your Booked Flights</h2>
        <p>Please log in to see your booked flights.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <h2 className="mb-4">Your Booked Flights</h2>
        <p>Loading booked flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <h2 className="mb-4">Your Booked Flights</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4 text-center">Your Booked Flights</h2>
      {bookedFlights.length === 0 ? (
        <p>No booked flights found.</p>
      ) : (
        <div className="row">
          {bookedFlights.map((flight) => (
            <div key={flight.bFId} className="col-md-4 mb-4">
              <div className={`card ${styles.card} p-3 shadow`}>
                <div className="card-body">
                  <p className="card-text">
                    <strong>From:</strong> {flight.from}
                  </p>
                  <p className="card-text">
                    <strong>To:</strong> {flight.to}
                  </p>
                  <p className="card-text">
                    <strong>Date:</strong> {new Date(flight.date).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Airline:</strong> {flight.airline}
                  </p>
                  <p className="card-text">
                    <strong>Flight Number:</strong> {flight.flightNumber}
                  </p>
                  <p className="card-text">
                    <strong>Adults:</strong> {flight.adults}
                  </p>
                  <p className="card-text">
                    <strong>Children:</strong> {flight.children}
                  </p>
                  <p className="card-text">
                    <strong>Total Price:</strong> $
                    {(flight.price ).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => cancelBooking(flight.bFId)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}