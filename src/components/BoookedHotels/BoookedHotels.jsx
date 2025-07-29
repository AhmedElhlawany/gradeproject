import React, { useEffect, useState } from 'react';
import styles from './BoookedHotels.module.css'; // لاحظ الـ typo في اسم الملف، المفروض BookedHotels.module.css

export default function BookedHotels() {
  const [bookedHotels, setBookedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    // جلب حجوزات الفنادق من الـ API
    fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/hotel-bookings`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotel bookings");
        return res.json();
      })
      .then((hotelBookings) => {
        setBookedHotels(hotelBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hotel bookings:", err);
        setError("Failed to load hotel bookings. Please try again.");
        setLoading(false);
      });
  }, [userEmail]);

  const handleCancel = async (bookingId) => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/cancel-hotel-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error cancelling booking");
      }

      // تحديث الـ state
      setBookedHotels((prev) => prev.filter((b) => b.bookingId !== bookingId));
      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert(`Failed to cancel booking: ${error.message}`);
    }
  };

  if (!userEmail) {
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
          {bookedHotels.map((hotel, index) => (
            <div key={hotel.bookingId} className="col-md-6 mb-4">
              <div className={`card ${styles.card} p-2`}>
                <div className="card-body">
                  <h5 className="card-title">{hotel.hotelName}</h5>
                  <p className="card-text"><strong>City:</strong> {hotel.city}</p>
                  <p className="card-text">
                    <strong>Rooms:</strong>{" "}
                    {hotel.rooms.map((room, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {room.count} {room.type} (${room.price} each)
                      </span>
                    ))}
                  </p>
                  <p className="card-text"><strong>Total Cost:</strong> ${hotel.totalCost.toFixed(2)}</p>
                  <p className="card-text"><strong>Guest:</strong> {hotel.fullName}</p>
                  <p className="card-text"><strong>Phone:</strong> {hotel.phone}</p>
                  <p className="card-text"><strong>Email:</strong> {hotel.email}</p>
                  <p className="card-text"><strong>Booking Date:</strong> {new Date(hotel.bookingDate).toLocaleDateString()}</p>
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