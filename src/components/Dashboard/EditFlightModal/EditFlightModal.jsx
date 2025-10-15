import React, { useState } from "react";
import styles from "./EditFlightModal.module.css";
import Swal from "sweetalert2";

export default function EditFlightModal({ flight, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    airline: flight.airline,
    from: flight.from,
    to: flight.to,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    date: flight.date,
    returnDate: flight.returnDate || "",
    price: flight.price.toString(),
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.airline) errors.airline = "Airline is required";
    if (!formData.from) errors.from = "Departure city is required";
    if (!formData.to) errors.to = "Arrival city is required";
    if (!formData.departureTime) errors.departureTime = "Departure time is required";
    if (!formData.arrivalTime) errors.arrivalTime = "Arrival time is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.price || formData.price <= 0) errors.price = "Price must be greater than 0";

    if (formData.departureTime && !/^[0-2][0-9]:[0-5][0-9]$/.test(formData.departureTime)) {
      errors.departureTime = "Invalid time format (HH:MM)";
    }
    if (formData.arrivalTime && !/^[0-2][0-9]:[0-5][0-9]$/.test(formData.arrivalTime)) {
      errors.arrivalTime = "Invalid time format (HH:MM)";
    }
    if (formData.date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      errors.date = "Invalid date format (YYYY-MM-DD)";
    }
    if (formData.returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.returnDate)) {
      errors.returnDate = "Invalid return date format (YYYY-MM-DD)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    try {
      const response = await fetch(`https://flyhigh.zeabur.app/api/flights/${flight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update flight");
      }

      Swal.fire({
        icon: "success",
        title: "Flight Updated",
        text: `Flight from ${formData.from} to ${formData.to} has been successfully updated!`,
        timer: 2000,
        showConfirmButton: false,
      });

      onSubmit(formData);
    } catch (error) {
      console.error("Error updating flight:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update flight. Please try again.",
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Edit Flight</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>From</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleFormChange}
                className={`${styles.formControl} ${formErrors.from ? styles.errorInput : ""}`}
                required
              />
              {formErrors.from && <div className={styles.errorMessage}>{formErrors.from}</div>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>To</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleFormChange}
                className={`${styles.formControl} ${formErrors.to ? styles.errorInput : ""}`}
                required
              />
              {formErrors.to && <div className={styles.errorMessage}>{formErrors.to}</div>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Airline</label>
            <input
              type="text"
              name="airline"
              value={formData.airline}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.airline ? styles.errorInput : ""}`}
              required
            />
            {formErrors.airline && <div className={styles.errorMessage}>{formErrors.airline}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Departure Time (HH:MM)</label>
            <input
              type="text"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.departureTime ? styles.errorInput : ""}`}
              placeholder="e.g., 09:00"
              required
            />
            {formErrors.departureTime && <div className={styles.errorMessage}>{formErrors.departureTime}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Arrival Time (HH:MM)</label>
            <input
              type="text"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.arrivalTime ? styles.errorInput : ""}`}
              placeholder="e.g., 13:30"
              required
            />
            {formErrors.arrivalTime && <div className={styles.errorMessage}>{formErrors.arrivalTime}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date (YYYY-MM-DD)</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.date ? styles.errorInput : ""}`}
              placeholder="e.g., 2025-07-20"
              required
            />
            {formErrors.date && <div className={styles.errorMessage}>{formErrors.date}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Return Date (YYYY-MM-DD)</label>
            <input
              type="text"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.returnDate ? styles.errorInput : ""}`}
              placeholder="e.g., 2025-07-25"
            />
            {formErrors.returnDate && <div className={styles.errorMessage}>{formErrors.returnDate}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className={`${styles.formControl} ${formErrors.price ? styles.errorInput : ""}`}
              min="0"
              step="0.01"
              required
            />
            {formErrors.price && <div className={styles.errorMessage}>{formErrors.price}</div>}
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>Save Changes</button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}