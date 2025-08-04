import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../UsersBookedFlights/UsersBookedFlights.module.css"; // Reuse same CSS or create a new one

export default function UsersBookedHotels() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithBookedHotels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersWithHotels = response.data.filter(
          (user) => user.bookedHotels && user.bookedHotels.length > 0
        );

        setUsers(usersWithHotels);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersWithBookedHotels();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Users' Booked Hotels</h2>
      {users.length === 0 ? (
        <div className="alert alert-info">No users with booked hotels.</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="mb-5">
            <table className={`${Style['tablebookedflights']} table table-bordered`}>
              <thead className={`${Style['tablebookedflightsHeader']} bg-success`}>
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Hotel Name</th>
                  <th>City</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>no.Rooms</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {user.bookedHotels.map((hotel, index) => {
                  const totalGuests = hotel.rooms?.reduce(
                    (sum, room) => sum + (room.count || 0),
                    0
                  ) || 0;

                  return (
                    <tr key={hotel.bookingId || index}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{hotel.hotelName}</td>
                      <td>{hotel.city}</td>
                      <td>{hotel.checkIn}</td>
                      <td>{hotel.checkOut}</td>
                      <td>{totalGuests}</td>
                      <td>${hotel.totalCost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
