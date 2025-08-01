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
          `http://localhost:3000/api/users/${currentUser.id}/bookings`,
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

  const cancelBooking = async (flightId) => {
    if (!currentUser || !token) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/${currentUser.id}/cancel-booking`,
        { flightId },
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

      // Update state to remove cancelled booking
      setBookedFlights((prev) => prev.filter((f) => f.id !== flightId));
      Swal.fire({
        icon: 'success',
        title: 'Booking Cancelled',
        text: 'Your flight booking has been cancelled successfully.',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      console.error('Cancellation failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: error.response?.data?.error || error.message,
        confirmButtonText: 'Ok',
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
      <h2 className="mb-4">Your Booked Flights</h2>
      {bookedFlights.length === 0 ? (
        <p>No booked flights found.</p>
      ) : (
        <div className="row">
          {bookedFlights.map((flight) => (
            <div key={flight.id} className="col-md-6 mb-4">
              <div className={`card ${styles.card} p-3`}>
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
                    {(flight.price * (flight.adults + flight.children * 0.5)).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => cancelBooking(flight.id)}
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