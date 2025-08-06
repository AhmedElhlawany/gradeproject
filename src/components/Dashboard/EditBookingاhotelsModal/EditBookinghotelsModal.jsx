import React, { useState, useEffect } from "react";
import styles from "./EditBookinghotelsModal.module.css";

export default function EditBookingModal({ booking, onClose }) {
  const [formData, setFormData] = useState({
    userName: "",
    hotelName: "",
    city: "",
    checkIn: "",
    checkOut: "",
    totalCost: "",
    rooms: [],
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        userName: booking.user.name || "",
        hotelName: booking.hotel.hotelName || "",
        city: booking.hotel.city || "",
        checkIn: booking.hotel.checkIn || "",
        checkOut: booking.hotel.checkOut || "",
        totalCost: booking.hotel.totalCost || "",
        rooms: booking.hotel.rooms || [],
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (index, value) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index].count = Number(value);
    setFormData((prev) => ({
      ...prev,
      rooms: updatedRooms,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated data to send:", formData);
  };

  if (!booking) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Edit Booking</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="hotelName">Hotel Name</label>
              <input
                type="text"
                id="hotelName"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="checkIn">Check-In Date</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="checkOut">Check-Out Date</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inlineGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="totalCost">Total Cost</label>
              <input
                type="number"
                id="totalCost"
                name="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Number of Rooms</label>
              {formData.rooms.length === 0 ? (
                <p style={{ fontSize: "0.9rem", color: "#888" }}>
                  No rooms data
                </p>
              ) : (
                formData.rooms.map((room, index) => (
                  <div key={index} className={styles.roomInput}>
                    <input
                      type="number"
                      min="0"
                      value={room.count}
                      onChange={(e) => handleRoomChange(index, e.target.value)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
