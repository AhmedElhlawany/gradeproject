import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import styles from "./Payment.module.css";

export default function Payment() {
  const { selectedFlight, adults, child } = useContext(FlightContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser?.email;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3}$/;

    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))) {
      return "Invalid card number. Must be 16 digits.";
    }

    if (!expiryRegex.test(formData.expiryDate)) {
      return "Expiry date must be in MM/YY format.";
    }

    const [month, year] = formData.expiryDate.split("/").map(Number);
    const now = new Date();
    const expiryDate = new Date(`20${year}`, month);
    if (expiryDate < now) {
      return "Card is expired.";
    }

    if (!cvvRegex.test(formData.cvv)) {
      return "Invalid CVV. Must be 3 digits.";
    }

    if (!formData.cardholderName.trim()) {
      return "Cardholder name is required.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!userEmail) {
      setError("Please login to book a flight.");
      return;
    }

    if (!selectedFlight?.id) {
      setError("Invalid flight data.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          adults,
          children: child,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to book flight");
      }

      setIsPaymentConfirmed(true);
      setError("");
    } catch (err) {
      console.error("Error booking flight:", err);
      setError(`Failed to book flight: ${err.message}`);
    }
  };

  const handleCancelBooking = async () => {
    if (!userEmail || !selectedFlight?.id) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/cancel-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flightId: selectedFlight.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to cancel booking");
      }

      setIsPaymentConfirmed(false);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(`Failed to cancel booking: ${err.message}`);
    }
  };

  const handleBackToFlights = () => navigate("/flights");

  if (!selectedFlight) {
    return (
      <div className="container text-center mt-5" style={{ paddingTop: "70px" }}>
        <h3>No flight selected</h3>
        <p>Please go back and select a flight first.</p>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h2 className={styles.sectionTitle}>Payment Details</h2>

      <div className={styles.paymentCard}>
        {isPaymentConfirmed ? (
          <div className={styles.confirmation}>
            <h3 className={styles.subTitle}>Booking Confirmed Successfully!</h3>
            <p className={styles.text}>
              Your flight from {selectedFlight.from} to {selectedFlight.to} on {selectedFlight.date} has been booked.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className={styles.confirmBtn} onClick={handleBackToFlights}>
                Back to Flights
              </button>
              <button className="btn btn-danger" onClick={handleCancelBooking}>
                Cancel Booking
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className={styles.subTitle}>Flight Summary</h3>
            <div className={styles.flightDetails}>
              <p><strong>From:</strong> {selectedFlight.from}</p>
              <p><strong>To:</strong> {selectedFlight.to}</p>
              <p><strong>Date:</strong> {selectedFlight.date}</p>
              <p><strong>Airline:</strong> {selectedFlight.airline}</p>
              <p><strong>Price:</strong> ${selectedFlight.price * (adults + child * 0.5)}</p>
            </div>

            <h3 className={styles.subTitle}>Payment Information</h3>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit} className={styles.paymentForm}>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234567812345678"
                  className={styles.input}
                  required
                  maxLength={16}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cvv" className={styles.label}>CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={styles.input}
                    required
                    maxLength={3}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cardholderName" className={styles.label}>Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={styles.input}
                  required
                />
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button type="submit" className={styles.confirmBtn}>
                  Confirm Payment
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}