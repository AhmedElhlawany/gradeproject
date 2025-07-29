import React, { useState } from "react";
import styles from "./AddAirlines.module.css";
import Swal from "sweetalert2";

export default function AddAirlines() {
  const [airlineForm, setAirlineForm] = useState({ name: "", code: "" });
  const [errors, setErrors] = useState({});

  const handleAirlineChange = (e) => {
    const { name, value } = e.target;
    setAirlineForm({ ...airlineForm, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAirlineSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!airlineForm.name) newErrors.name = "Airline name is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    console.log("Airline added:", airlineForm);
    Swal.fire({
      icon: "success",
      title: "Airline Added",
      text: `Airline ${airlineForm.name} has been successfully added!`,
      timer: 2000,
      showConfirmButton: false,
    });
    setAirlineForm({ name: "", code: "" });
    setErrors({});
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Add New Airline</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleAirlineSubmit} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Airline Name</label>
            <input
              type="text"
              name="name"
              value={airlineForm.name}
              onChange={handleAirlineChange}
              className={`${styles.formControl} form-control ${errors.name ? styles.isInvalid : airlineForm.name ? styles.isValid : ""}`}
            />
            {errors.name && <div className={styles.invalidFeedback}>{errors.name}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Airline Code (Optional)</label>
            <input
              type="text"
              name="code"
              value={airlineForm.code}
              onChange={handleAirlineChange}
              className={`${styles.formControl} form-control`}
              placeholder="e.g., EK for Emirates"
            />
          </div>
          <button type="submit" className={styles.submitButton}>Add Airline</button>
        </form>
      </div>
    </div>
  );
}