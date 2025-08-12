import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter, FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Style from "./UsersBookedFlights.module.css";

export default function UsersBookedFlights() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    userName: "",
    from: "",
    to: "",
    date: "",
    airline: "",
    price: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchUsersWithBookedFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          await Swal.fire({
            icon: "error",
            title: "Authentication Required",
            text: "Please log in to access this page.",
          });
          return;
        }
        const response = await axios.get("https://flyhigh.zeabur.app/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersWithFlights = response.data.filter(
          (user) => user.bookedFlights && user.bookedFlights.length > 0
        );

        setUsers(usersWithFlights);
        setFilteredUsers(usersWithFlights);
      } catch (error) {
        console.error("Error fetching users:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch users. Please try again.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: `btn ${Style.conbtn}`,
          }
        });
      }
    };

    fetchUsersWithBookedFlights();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = users
        .map((user) => ({
          ...user,
          bookedFlights: user.bookedFlights.filter((flight) => {
            const matchesUserName = filters.userName
              ? user.name.toLowerCase().includes(filters.userName.toLowerCase())
              : true;
            const matchesFrom = filters.from
              ? flight.from.toLowerCase().includes(filters.from.toLowerCase())
              : true;
            const matchesTo = filters.to
              ? flight.to.toLowerCase().includes(filters.to.toLowerCase())
              : true;
            const matchesDate = filters.date
              ? new Date(flight.date).toISOString().slice(0, 10) === filters.date
              : true;
            const matchesAirline = filters.airline
              ? flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
              : true;
            const matchesPrice = filters.price
              ? flight.price.toString().includes(filters.price)
              : true;

            return (
              matchesUserName &&
              matchesFrom &&
              matchesTo &&
              matchesDate &&
              matchesAirline &&
              matchesPrice
            );
          }),
        }))
        .filter((user) => user.bookedFlights.length > 0);

      setFilteredUsers(filtered);
    };

    applyFilters();
  }, [filters, users]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ userName: "", from: "", to: "", date: "", airline: "", price: "" });
  };

  const handleClearInput = (name) => {
    setFilters((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDelete = async (userId, bFId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this flight?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      customClass: {
                  confirmButton: `btn ${Style['conbtn']}`,
                },
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        await Swal.fire({
          icon: "error",
          title: "Authentication Required",
          text: "Please log in to perform this action.",
          confirmButtonText: "OK",
           customClass: {
                    confirmButton: `btn ${Style['conbtn']}`,
                  }
        });
        return;
      }

      // Send flightId to backend
      await axios.post(
        `https://flyhigh.zeabur.app/api/users/${userId}/cancel-booking`,
        { bFId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user flights in state
      const updateUserFlights = (prevUsers) =>
        prevUsers
          .map((user) =>
            user.id === userId
              ? {
                  ...user,
                  bookedFlights: user.bookedFlights.filter(
                    (flight) => flight.bFId !== bFId
                  ),
                }
              : user
          )
          .filter((user) => user.bookedFlights.length > 0);

      setUsers((prev) => updateUserFlights(prev));
      setFilteredUsers((prev) => updateUserFlights(prev));

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Flight canceled successfully.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: `btn ${Style['conbtn']}`,
        }
      });
    } catch (error) {
      console.error("Error canceling flight:", error);
      const errorMessage =
        error.response?.status === 403
          ? `Only the admin (ahmedelhalawany429@gmail.com) or the user can cancel flights.`
          : error.response?.data?.message || "Failed to cancel flight. Please try again.";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: `btn ${Style['conbtn']}`,
        }
      });
    }
  };

  return (
    <div className={Style.container}>
      <h2 className={Style.headerTitle}>Users' Booked Flights</h2>
      <div className={Style.filterSection}>
        <button
          className={Style.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className={Style.filterIcon} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {showFilters && (
          <div className={Style.filterContainer}>
            <div className={Style.filterGroup}>
              <div className={Style.filterItem}>
                <label htmlFor="userName" className={Style.filterLabel}>
                  User Name
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Filter by User Name"
                    value={filters.userName}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.userName && (
                    <button
                      type="button"
                      className={Style.clearInputButton}
                      onClick={() => handleClearInput("userName")}
                      aria-label="Clear User Name"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={Style.filterItem}>
                <label htmlFor="from" className={Style.filterLabel}>
                  From
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    placeholder="Filter by From"
                    value={filters.from}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.from && (
                    <button
                      type="button"
                      className={Style.clearInputButton}
                      onClick={() => handleClearInput("from")}
                      aria-label="Clear From"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={Style.filterItem}>
                <label htmlFor="to" className={Style.filterLabel}>
                  To
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    placeholder="Filter by To"
                    value={filters.to}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.to && (
                    <button
                      type="button"
                      className={Style.clearInputButton}
                      onClick={() => handleClearInput("to")}
                      aria-label="Clear To"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={Style.filterItem}>
                <label htmlFor="date" className={Style.filterLabel}>
                  Date
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.date && (
                    <button
                      type="button"
                      className={`${Style.clearInputButton} ${Style.clearDateButton}`}
                      onClick={() => handleClearInput("date")}
                      aria-label="Clear Date"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={Style.filterItem}>
                <label htmlFor="airline" className={Style.filterLabel}>
                  Airline
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="text"
                    id="airline"
                    name="airline"
                    placeholder="Filter by Airline"
                    value={filters.airline}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.airline && (
                    <button
                      type="button"
                      className={Style.clearInputButton}
                      onClick={() => handleClearInput("airline")}
                      aria-label="Clear Airline"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={Style.filterItem}>
                <label htmlFor="price" className={Style.filterLabel}>
                  Price
                </label>
                <div className={Style.inputWrapper}>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Filter by Price"
                    value={filters.price}
                    onChange={handleFilterChange}
                    className={Style.filterInput}
                  />
                  {filters.price && (
                    <button
                      type="button"
                      className={`${Style.clearInputButton} ${Style.clearPriceButton}`}
                      onClick={() => handleClearInput("price")}
                      aria-label="Clear Price"
                    >
                      <FaTimes className={Style.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              className={Style.clearButton}
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <div className={Style.tableWrapper}>
        {filteredUsers.length === 0 ? (
          <div className={Style.empty}>No users with booked flights match the filters.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="mb-5">
              <table className={`${Style.tablebookedflights} table table-bordered`}>
                <thead className={`${Style.tablebookedflightsHeader}`}>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Airline</th>
                    <th>Price</th>
                    <th>Passengers</th>
                    <th>Actions</th>
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
                      <td>{flight.adults + flight.children}</td>
                      <td>
                        <button
                          className={Style.deleteButton}
                          onClick={() => handleDelete(user.id, flight.bFId)}
                          title="Cancel Flight"
                        >
                          <FaTrash className={Style.deleteIcon} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}