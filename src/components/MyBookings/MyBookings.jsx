import React, { useEffect, useState } from 'react'
import Style from './MyBookings.module.css'
export default function MyBookings() {
 const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("userEmail");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    setMyBookings(bookings[user] || []);
  }, []);

  const cancelBooking = (index) => {
    const user = localStorage.getItem("userEmail");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    const updated = [...(bookings[user] || [])];
    updated.splice(index, 1); // احذف الرحلة
    bookings[user] = updated;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    setMyBookings(updated);
  };

  if (myBookings.length === 0) {
    return <div className="container mt-5">No bookings found.</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2>My Flights</h2>
      {myBookings.map((flight, i) => (
        <div key={i} className="card mb-3 p-3">
          <p><strong>From:</strong> {flight.from}</p>
          <p><strong>To:</strong> {flight.to}</p>
          <p><strong>Date:</strong> {flight.date}</p>
          <p><strong>Airline:</strong> {flight.airline}</p>
          <p><strong>Passengers:</strong> {flight.numberOfPersons}</p>
          <p><strong>Total Price:</strong> ${flight.price * flight.numberOfPersons}</p>
          <button className="btn btn-danger" onClick={() => cancelBooking(i)}>Cancel Booking</button>
        </div>
      ))}
    </div>
  );
}
