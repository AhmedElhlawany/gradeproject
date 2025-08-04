import React, { useEffect, useState } from 'react';
import styles from './BoookedHotels.module.css'; // Fixed typo in import
import axios from 'axios';
import Swal from 'sweetalert2';

export default function BookedHotels() {
  const [bookedHotels, setBookedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || !token) {
      setLoading(false);
      return;
    }

    // Fetch hotel bookings from API
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${currentUser.id}/hotel-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setBookedHotels(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hotel bookings:', err);
        setError(err.response?.data?.error || 'Failed to load hotel bookings. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, token]);

  const handleCancel = async (bookingId) => {
    if (!currentUser || !token) return;

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
        throw new Error(response.data.error || 'Error cancelling booking');
      }

      // Update state to remove cancelled booking
      setBookedHotels((prev) => prev.filter((b) => b.bookingId !== bookingId));
      Swal.fire({
        icon: 'success',
        title: 'Booking Cancelled',
        text: 'Your hotel booking has been cancelled successfully.',
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
      <div className="container py-5">
        <h2 className="mb-4 pt-5">Your Booked Hotels</h2>
        <p>Please log in to see your hotel bookings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 pt-5">Your Booked Hotels</h2>
        <p>Loading hotel bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 pt-5">Your Booked Hotels</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 pt-5">Your Booked Hotels</h2>
      {bookedHotels.length === 0 ? (
        <p>No hotel bookings found.</p>
      ) : (
        <div className="row">
          {bookedHotels.map((hotel) => (
            <div key={hotel.bookingId} className="col-md-6 mb-4">
              <div className={`card ${styles.card} p-2`}>
                <div className="card-body">
                  <h5 className="card-title">{hotel.hotelName}</h5>
                  <p className="card-text">
                    <strong>City:</strong> {hotel.city}
                  </p>
                  <p className="card-text">
                    <strong>Rooms:</strong>{' '}
                    {hotel.rooms.map((room, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {room.count} {room.type} (${room.price} each)
                      </span>
                    ))}
                  </p>
                  <p className="card-text">
                    <strong>Total Cost:</strong> ${hotel.totalCost.toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Guest:</strong> {hotel.fullName}
                  </p>
                  <p className="card-text">
                    <strong>Phone:</strong> {hotel.phone}
                  </p>
                  <p className="card-text">
                    <strong>Booking Date:</strong>{' '}
                    {new Date(hotel.bookingDate).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleCancel(hotel.bookingId)}
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