import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "./UsersBookedFlights.module.css";

export default function UsersBookedFlights() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithBookedFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersWithFlights = response.data.filter(
          (user) => user.bookedFlights && user.bookedFlights.length > 0
        );

        setUsers(usersWithFlights);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersWithBookedFlights();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Users' Booked Flights</h2>
      {users.length === 0 ? (
        <div className="alert alert-info">No users with booked flights.</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="mb-5">
           
            <table className={`${Style['tablebookedflights']} table table-bordered`}>
              <thead className={`${Style['tablebookedflightsHeader']} bg-primary`}>
                <tr className="bg-primary">
                  <th>#</th>
                  <th>User ID</th>
                  <th>User name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                  <th>Airline</th>
                  <th>Price</th>
                  <th>Passengers</th>
                </tr> 
              </thead>
              <tbody>
                {user.bookedFlights.map((flight, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{flight.from}</td>
                    <td>{flight.to}</td>
                    <td>{flight.date}</td>
                    <td>{flight.airline}</td>
                    <td>${flight.price}</td>
                    <td>{flight.persons || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
