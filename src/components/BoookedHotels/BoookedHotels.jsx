import React, { useEffect, useState } from 'react';
import styles from './BoookedHotels.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function BookedHotels() {
  const [bookedHotels, setBookedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', checkInDate: '', checkOutDate: '' });

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!currentUser || !token) {
      setLoading(false);
      return;
    }

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
        `http://flyhigh.zeabur.app/api/users/${currentUser.id}/cancel-hotel-booking`,
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

      setBookedHotels((prev) => prev.filter((b) => b.bookingId !== bookingId));
      Swal.fire({
        icon: 'success',
        title: 'Booking Cancelled',
        text: 'Your hotel booking has been cancelled successfully.',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: `btn ${styles['conbtn']}`,
        },
      });
    } catch (error) {
      console.error('Cancellation failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: error.response?.data?.error || error.message,
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: `btn ${styles['conbtn']}`,
        },
      });
    }
  };

  const handleEditClick = (booking) => {
    setEditBooking(booking);
    setFormData({
      fullName: booking.fullName,
      phone: booking.phone,
      checkInDate: booking.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] : '',
      checkOutDate: booking.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] : '',
    });
  };

  const resetEditForm = () => {
    setEditBooking(null);
    setFormData({ fullName: '', phone: '', checkIn: '', checkOutDate: '' });
  };

 const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!currentUser || !token || !editBooking) return;

  try {
    const response = await axios.put(
      `http://localhost:3000/api/users/${currentUser.id}/edit-hotel-booking`,
      {
        bookingId: editBooking.bookingId,
        updatedBooking: {
          fullName: formData.fullName,
          phone: formData.phone,
          checkIn: formData.checkInDate,   
          checkOut: formData.checkOutDate, 
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data.error || 'Error updating booking');
    }

    setBookedHotels((prev) =>
      prev.map((b) =>
        b.bookingId === editBooking.bookingId
          ? { ...b, ...formData, checkIn: formData.checkInDate, checkOut: formData.checkOutDate }
          : b
      )
    );

    resetEditForm();
    document.querySelector('#editBookingModal .btn-close')?.click();

    Swal.fire({
      icon: 'success',
      title: 'Booking Updated',
      text: 'Your hotel booking has been updated successfully.',
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: `btn ${styles['conbtn']}`,
      },
    });
  } catch (error) {
    console.error('Update failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.error || error.message,
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: `btn ${styles['conbtn']}`,
      },
    });
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
      <h2 className="mb-4 pt-5 text-center">Your Booked Hotels</h2>
      {bookedHotels.length === 0 ? (
        <p>No hotel bookings found.</p>
      ) : (
        <div className="row">
          {bookedHotels.map((hotel) => (
            <div key={hotel.bookingId} className="col-md-4 mb-4">
              <div className={`card ${styles.card} p-2 shadow`}>
                <div className="card-body">
                  <h5 className="card-title">{hotel.hotelName}</h5>
                  <p className="card-text">
                    <strong>City:</strong> {hotel.city}
                  </p>
                  <p className="card-text">
                    <strong>Rooms:</strong>{' '}
                    {hotel.rooms.map((room, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {room.count} {room.type}{room.count > 1 ? 's' : ''} (${room.price} each)
                      </span>
                    ))}
                  </p>
                  <p className="card-text">
                    <strong>Total Cost:</strong> ${hotel.totalCost}
                  </p>
                  <p className="card-text">
                    <strong>Guest:</strong> {hotel.fullName}
                  </p>
                  <p className="card-text">
                    <strong>Phone:</strong> {hotel.phone}
                  </p>
                  <p className="card-text">
                    <strong>Check-In:</strong>{' '}
                    {hotel.checkIn ? new Date(hotel.checkIn).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="card-text">
                    <strong>Check-Out:</strong>{' '}
                    {hotel.checkOut ? new Date(hotel.checkOut).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="card-text">
                    <strong>Booking Date:</strong>{' '}
                    {new Date(hotel.bookingDate).toLocaleDateString()}
                  </p>
                  <button
                    className={`btn ${styles['save-button']} mt-2 me-2`}
                    data-bs-toggle="modal"
                    data-bs-target="#editBookingModal"
                    onClick={() => handleEditClick(hotel)}
                  >
                    Edit Booking
                  </button>
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

      {/* Bootstrap Modal for Editing */}
      <div
        className="modal fade"
        id="editBookingModal"
        tabIndex="-1"
        aria-labelledby="editBookingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content" style={{ marginTop: '100px' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="editBookingModalLabel">
                Edit Booking
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetEditForm}
              ></button>
            </div>
            <div className="modal-body">
              {editBooking && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkInDate" className="form-label">Check-In Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkInDate"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkOutDate" className="form-label">Check-Out Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <button type="submit" className={`btn ${styles['save-button']}`}>Save Changes</button>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetEditForm}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
