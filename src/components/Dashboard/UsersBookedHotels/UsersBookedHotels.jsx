import { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Style from "./UsersBookedHotels.module.css";
import Swal from "sweetalert2";

export default function UsersBookedHotels() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    userName: "",
    hotelName: "",
    city: "",
    checkIn: "",
    checkOut: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    checkIn: "",
    checkOut: "",
    totalCost: "",
    discountApplied: "",
  });

  useEffect(() => {
    const fetchUsersWithBookedHotels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://flyhigh.zeabur.app/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersWithHotels = response.data.filter(
          (user) => user.bookedHotels && user.bookedHotels.length > 0
        );

        setUsers(usersWithHotels);
        setFilteredUsers(usersWithHotels);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersWithBookedHotels();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = users
        .map((user) => ({
          ...user,
          bookedHotels: user.bookedHotels.filter((hotel) => {
            const matchesUserName = filters.userName
              ? user.name.toLowerCase().includes(filters.userName.toLowerCase())
              : true;
            const matchesHotelName = filters.hotelName
              ? hotel.hotelName.toLowerCase().includes(filters.hotelName.toLowerCase())
              : true;
            const matchesCity = filters.city
              ? hotel.city.toLowerCase().includes(filters.city.toLowerCase())
              : true;
            const matchesCheckIn = filters.checkIn
              ? new Date(hotel.checkIn).toISOString().slice(0, 10) === filters.checkIn
              : true;
            const matchesCheckOut = filters.checkOut
              ? new Date(hotel.checkOut).toISOString().slice(0, 10) === filters.checkOut
              : true;

            return (
              matchesUserName &&
              matchesHotelName &&
              matchesCity &&
              matchesCheckIn &&
              matchesCheckOut
            );
          }),
        }))
        .filter((user) => user.bookedHotels.length > 0);

      setFilteredUsers(filtered);
    };

    applyFilters();
  }, [filters, users]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      userName: "",
      hotelName: "",
      city: "",
      checkIn: "",
      checkOut: "",
    });
  };

  const handleClearInput = (name) => {
    setFilters((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEdit = (userId, bookingId) => {
    const user = users.find((u) => u.id === userId);
    const hotel = user?.bookedHotels.find((h) => h.bookingId === bookingId);
    if (user && hotel) {
      setSelectedBooking({ user, hotel });
      setEditForm({
        checkIn: hotel.checkIn,
        checkOut: hotel.checkOut,
      });
      setShowEditModal(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBooking = async () => {
    const token = localStorage.getItem("token");
    const { user, hotel } = selectedBooking;

    try {
      const res = await axios.put(
        `https://flyhigh.zeabur.app/api/users/${user.id}/edit-hotel-booking`,
        {
          bookingId: hotel.bookingId,
          updatedBooking: editForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.updatedBooking;

      const updateUserHotels = (usersList) =>
        usersList.map((u) =>
          u.id === user.id
            ? {
                ...u,
                bookedHotels: u.bookedHotels.map((b) =>
                  b.bookingId === hotel.bookingId ? updated : b
                ),
              }
            : u
        );

      setUsers((prev) => updateUserHotels(prev));
      setFilteredUsers((prev) => updateUserHotels(prev));

      setShowEditModal(false);
      Swal.fire({
        title: "Booking updated successfully",
        icon: "success",
        confirmButtonText: "OK",
         customClass: {
        confirmButton: `btn ${Style["conbtn"]}`,
      },

      });
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire(
        "Error",
        error.response?.data?.error || "Failed to update booking",
        "error",
        { customClass: {
          confirmButton: `btn ${Style["conbtn"]}`,
        },}
      );
    }
  };

  const cancelHotelBooking = async (bookingId, userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this hotel booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      customClass: {
        confirmButton: `btn ${Style["conbtn"]}`,
      },
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://flyhigh.zeabur.app/api/users/${userId}/cancel-hotel-booking`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updateUserHotels = (prevUsers) =>
        prevUsers
          .map((user) =>
            user.id === userId
              ? {
                  ...user,
                  bookedHotels: user.bookedHotels.filter(
                    (booking) => booking.bookingId !== bookingId
                  ),
                }
              : user
          )
          .filter((user) => user.bookedHotels?.length > 0);

      setUsers((prev) => updateUserHotels(prev));
      setFilteredUsers((prev) => updateUserHotels(prev));

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Hotel booking canceled successfully.",
        confirmButtonText: "OK",
         customClass: {
                  confirmButton: `btn ${Style['conbtn']}`,
                }
      });
    } catch (error) {
      console.error("Error canceling hotel booking:", error);
      const errorMessage =
        error.response?.status === 403
          ? `Only the admin or the user can cancel hotel bookings.`
          : error.response?.data?.error || "Failed to cancel hotel booking.";
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
      <h2 className={Style.headerTitle}>Users' Booked Hotels</h2>

      {/* Filters */}
      <div className={Style.filterSection}>
        <button className={Style.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <FaFilter className={Style.filterIcon} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className={Style.filterContainer}>
            <div className={Style.filterGroup}>
              {["userName", "hotelName", "city"].map((field) => (
                <div key={field} className={Style.filterItem}>
                  <label htmlFor={field} className={Style.filterLabel}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className={Style.inputWrapper}>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      placeholder={`Filter by ${field}`}
                      value={filters[field]}
                      onChange={handleFilterChange}
                      className={Style.filterInput}
                    />
                    {filters[field] && (
                      <button
                        type="button"
                        className={Style.clearInputButton}
                        onClick={() => handleClearInput(field)}
                      >
                        <FaTimes className={Style.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {["checkIn", "checkOut"].map((dateField) => (
                <div key={dateField} className={Style.filterItem}>
                  <label htmlFor={dateField} className={Style.filterLabel}>
                    {dateField === "checkIn" ? "Check-In Date" : "Check-Out Date"}
                  </label>
                  <div className={Style.inputWrapper}>
                    <input
                      type="date"
                      id={dateField}
                      name={dateField}
                      value={filters[dateField]}
                      onChange={handleFilterChange}
                      className={Style.dateInput}
                    />
                    {filters[dateField] && (
                      <button
                        type="button"
                        className={Style.clearDateButton}
                        onClick={() => handleClearInput(dateField)}
                      >
                        <FaTimes className={Style.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className={Style.clearButton} onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={Style.tableWrapper}>
        {filteredUsers.length === 0 ? (
          <div className={Style.empty}>No users with booked hotels match the filters.</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="mb-5">
              <table className={Style.tablebookedhotels}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Hotel Name</th>
                    <th>City</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>No. Rooms</th>
                    <th>Total Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {user.bookedHotels.map((hotel, index) => {
                    const totalGuests = hotel.rooms?.reduce((sum, room) => sum + room.count, 0);
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
                        <td>
                          <button className={Style.editButton} onClick={() => handleEdit(user.id, hotel.bookingId)}>
                            <FaEdit className={Style.editIcon} />
                          </button>
                          <button className={Style.deleteButton} onClick={() => cancelHotelBooking(hotel.bookingId, user.id)}>
                            <FaTrash className={Style.deleteIcon} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      {/* Bootstrap Modal for Editing Booking */}
      {showEditModal && selectedBooking && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Booking</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Check-In</label>
                  <input type="date" className="form-control" name="checkIn" value={editForm.checkIn} onChange={handleEditChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Check-Out</label>
                  <input type="date" className="form-control" name="checkOut" value={editForm.checkOut} onChange={handleEditChange} />
                </div>
               
               
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className={`btn ${Style['saveButton']}`} onClick={handleUpdateBooking}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
