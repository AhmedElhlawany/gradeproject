import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2
import styles from "./Users.module.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [filters, setFilters] = useState({ name: "", email: "", phone: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.phone.toLowerCase().includes(filters.phone.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, filters]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users. Please try again.",
      });
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ name: "", email: "", phone: "" });
  };

  const handleClearInput = (name) => {
    setFilters((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.user.id ? updated.user : u))
      );
      setShowEditModal(false);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user. Please try again.",
      });
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c82333",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to delete user");

        setUsers((prev) => prev.filter((u) => u.id !== id));

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete user. Please try again.",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>All Users</h1>
      <div className={styles.filterSection}>
        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className={styles.filterIcon} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {showFilters && (
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <div className={styles.filterItem}>
                <label htmlFor="name" className={styles.filterLabel}>
                  Name
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Filter by Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.name && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("name")}
                      aria-label="Clear Name Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="email" className={styles.filterLabel}>
                  Email
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Filter by Email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.email && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("email")}
                      aria-label="Clear Email Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="phone" className={styles.filterLabel}>
                  Phone
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Filter by Phone"
                    value={filters.phone}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.phone && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("phone")}
                      aria-label="Clear Phone Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button className={styles.clearButton} onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <div className={styles.tableWrapper}>
        {filteredUsers.length === 0 ? (
          <div className={styles.empty}>
            No users available for the selected filters.
          </div>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Favorites</th>
                <th>Booked Flights</th>
                <th>Booked Hotels</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.favorites.length}</td>
                  <td>{user.bookedFlights.length}</td>
                  <td>{user.bookedHotels.length}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(user)}
                      title="Edit User"
                    >
                      <FaEdit className={styles.editIcon} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash className={styles.deleteIcon} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showEditModal && (
        <div
          className="modal d-block mt-5"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={editForm.phone}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${styles["conbtn"]}`}
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}