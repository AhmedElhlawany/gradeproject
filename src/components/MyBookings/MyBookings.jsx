import React, { useEffect, useState } from "react";
import styles from "./MyBookings.module.css";

export default function MyBookings() {
  const [favoriteFlights, setFavoriteFlights] = useState([]);
  const [bookedFlights, setBookedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    // جلب الـ favorites والـ booked flights معًا
    Promise.all([
      fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`),
      fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/bookings`),
    ])
      .then(([favRes, bookRes]) => {
        if (!favRes.ok) throw new Error("Failed to fetch favorites");
        if (!bookRes.ok) throw new Error("Failed to fetch bookings");
        return Promise.all([favRes.json(), bookRes.json()]);
      })
      .then(([favorites, bookings]) => {
        const flightsOnly = favorites.filter((f) => f.type === "flight");
        setFavoriteFlights(flightsOnly);
        setBookedFlights(bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      });
  }, [userEmail]);

  const removeFavorite = async (flightId) => {
    if (!userEmail) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: flightId, type: "flight" }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove favorite");
      }

      // تحديث الـ state
      setFavoriteFlights((prev) => prev.filter((f) => f.id !== flightId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(`Failed to remove favorite: ${err.message}`);
    }
  };

  const cancelBooking = async (flightId) => {
    if (!userEmail) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/cancel-booking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flightId }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to cancel booking");
      }

      // تحديث الـ state
      setBookedFlights((prev) => prev.filter((f) => f.id !== flightId));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(`Failed to cancel booking: ${err.message}`);
    }
  };

  if (!userEmail) {
    return (
      <div className="container mt-5">
        Please log in to see your favorites and bookings.
      </div>
    );
  }

  if (loading) {
    return <div className="container mt-5">Loading data...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5 pt-5">

      <h2 className={styles.sectionTitle}>My Booked Flights</h2>
      {bookedFlights.length === 0 ? (
        <p>No booked flights found.</p>
      ) : (
        bookedFlights.map((flight, i) => (
          <div key={i} className="card mb-3 p-3">
            <p><strong>From:</strong> {flight.from}</p>
            <p><strong>To:</strong> {flight.to}</p>
            <p><strong>Date:</strong> {flight.date}</p>
            <p><strong>Airline:</strong> {flight.airline}</p>
            <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
            <p><strong>Adults:</strong> {flight.adults}</p>
            <p><strong>Children:</strong> {flight.children}</p>
            <p>
              <strong>Total Price:</strong> $
              {flight.price * (flight.adults + flight.children * 0.5)}
            </p>
            <button
              className="btn btn-outline-danger"
              onClick={() => cancelBooking(flight.id)}
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
}