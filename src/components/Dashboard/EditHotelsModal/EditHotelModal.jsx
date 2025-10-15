import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "./EditHotelModal.module.css";

export default function EditHotelModal({ hotel, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: hotel.name,
    city: hotel.city,
    rate: hotel.rate,
    onSale: hotel.onSale,
    contact: { phone: hotel.contact.phone, email: hotel.contact.email },
    amenities: hotel.amenities.join(", "),
    availableRooms: hotel.availableRooms.map((room) => ({ ...room })),
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("contact.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        contact: { ...formData.contact, [field]: value },
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...formData.availableRooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setFormData({ ...formData, availableRooms: updatedRooms });
    setErrors({ ...errors, [`room${index}`]: "" });
  };

  const addRoom = () => {
    setFormData({
      ...formData,
      availableRooms: [...formData.availableRooms, { type: "", quantity: 0, price: 0 }],
    });
  };

  const removeRoom = (index) => {
    setFormData({
      ...formData,
      availableRooms: formData.availableRooms.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.rate) newErrors.rate = "Rate is required";
    else {
      const rateValue = parseFloat(formData.rate);
      if (isNaN(rateValue) || rateValue < 1 || rateValue > 5) {
        newErrors.rate = "Rate must be a number between 1 and 5";
      }
    }
    if (!formData.contact.phone) newErrors["contact.phone"] = "Phone is required";
    if (!formData.contact.email) newErrors["contact.email"] = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) newErrors["contact.email"] = "Invalid email format";
    formData.availableRooms.forEach((room, index) => {
      if (!room.type) newErrors[`room${index}`] = "Room type is required";
      else if (room.quantity < 0) newErrors[`room${index}`] = "Quantity cannot be negative";
      else if (room.price < 0) newErrors[`room${index}`] = "Price cannot be negative";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form.",
      });
      return;
    }

    try {
      const response = await fetch(`http://flyhigh.zeabur.app/api/hotels/${hotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"
          ,
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
         },
        body: JSON.stringify({
          ...formData,
          rate: parseFloat(formData.rate),
          amenities: formData.amenities ? formData.amenities.split(",").map((item) => item.trim()) : [],
          availableRooms: formData.availableRooms.map((room) => ({
            type: room.type,
            quantity: parseInt(room.quantity),
            price: parseFloat(room.price),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update hotel");
      }

      const updatedHotel = await response.json();
      onSave(updatedHotel);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Hotel updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update hotel. Please try again.",
      });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Edit Hotel</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.formControl} ${errors.name ? styles.errorInput : ""}`}
              />
              {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.formLabel}>City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`${styles.formControl} ${errors.city ? styles.errorInput : ""}`}
              />
              {errors.city && <div className={styles.errorMessage}>{errors.city}</div>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="rate" className={styles.formLabel}>Rate (1-5, e.g., 4.5)</label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                min="1"
                max="5"
                step="0.1"
                className={`${styles.formControl} ${errors.rate ? styles.errorInput : ""}`}
              />
              {errors.rate && <div className={styles.errorMessage}>{errors.rate}</div>}
            </div>
            <div className={styles.formGroup}>
              <div className={styles.checkboxContainer}>
                <label htmlFor="onSale" className={styles.formLabel}>On Sale</label>
                <input
                  type="checkbox"
                  id="onSale"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.formLabel}>Contact Phone</label>
            <input
              type="text"
              id="phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleInputChange}
              className={`${styles.formControl} ${errors["contact.phone"] ? styles.errorInput : ""}`}
            />
            {errors["contact.phone"] && <div className={styles.errorMessage}>{errors["contact.phone"]}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Contact Email</label>
            <input
              type="email"
              id="email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleInputChange}
              className={`${styles.formControl} ${errors["contact.email"] ? styles.errorInput : ""}`}
            />
            {errors["contact.email"] && <div className={styles.errorMessage}>{errors["contact.email"]}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amenities" className={styles.formLabel}>Amenities (comma-separated)</label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              className={styles.formControl}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Available Rooms</label>
            {formData.availableRooms.map((room, index) => (
              <div key={index} className={styles.roomGroup}>
                <input
                  type="text"
                  placeholder="Room Type"
                  value={room.type}
                  onChange={(e) => handleRoomChange(index, "type", e.target.value)}
                  className={`${styles.formControl} ${errors[`room${index}`] ? styles.errorInput : ""}`}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={room.quantity}
                  onChange={(e) => handleRoomChange(index, "quantity", e.target.value)}
                  min="0"
                  className={`${styles.formControl} ${errors[`room${index}`] ? styles.errorInput : ""}`}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={room.price}
                  onChange={(e) => handleRoomChange(index, "price", e.target.value)}
                  min="0"
                  step="0.01"
                  className={`${styles.formControl} ${errors[`room${index}`] ? styles.errorInput : ""}`}
                />
                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  className={styles.removeRoomButton}
                >
                  Remove
                </button>
                {errors[`room${index}`] && <div className={styles.errorMessage}>{errors[`room${index}`]}</div>}
              </div>
            ))}
            <button type="button" onClick={addRoom} className={styles.addRoomButton}>
              Add Room
            </button>
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}