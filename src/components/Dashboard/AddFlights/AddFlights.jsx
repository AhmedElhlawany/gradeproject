import React, { useState, useEffect } from "react";
import styles from "./AddFlights.module.css";
import Swal from "sweetalert2";

export default function AddFlights({ onFlightAdded }) {
  const [flightForm, setFlightForm] = useState({
    from: "", to: "", date: "", returnDate: "", departureTime: "", arrivalTime: "", price: "", airline: "", transitCity: "", transitDuration: "",
  });
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAirlines, setLoadingAirlines] = useState(true);
  const [cityError, setCityError] = useState(null);
  const [airlineError, setAirlineError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/places");
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        const cityList = [...new Set(data.map((item) => item.city))];
        setCities(cityList);
        setLoadingCities(false);
      } catch (err) {
        setCityError(err.message);
        setLoadingCities(false);
      }
    };
    const fetchAirlines = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/flights");
        if (!response.ok) throw new Error("Failed to fetch flights");
        const data = await response.json();
        const airlineList = [...new Set(data.map((flight) => flight.airline).filter(Boolean))];
        setAirlines(airlineList);
        setLoadingAirlines(false);
      } catch (err) {
        setAirlineError(err.message);
        setLoadingAirlines(false);
      }
    };
    fetchCities();
    fetchAirlines();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date("2025-07-27T15:31:00+03:00");
    const currentYear = 2025;
    const selectedDate = flightForm.date ? new Date(flightForm.date) : null;

    if (!flightForm.from) newErrors.from = "Origin city is required";
    if (!flightForm.to) newErrors.to = "Destination city is required";
    if (!flightForm.date) newErrors.date = "Departure date is required";
    if (!flightForm.price) newErrors.price = "Price is required";
    if (!flightForm.airline) newErrors.airline = "Airline is required";
    if (!flightForm.departureTime) newErrors.departureTime = "Departure time is required";
    if (!flightForm.arrivalTime) newErrors.arrivalTime = "Arrival time is required";

    if (flightForm.date) {
      if (selectedDate < today) newErrors.date = "Departure date cannot be in the past";
      if (selectedDate.getFullYear() < currentYear) newErrors.date = "Year cannot be in the past";
    }

    if (flightForm.departureTime && flightForm.arrivalTime) {
      const [depHours, depMinutes] = flightForm.departureTime.split(":").map(Number);
      const [arrHours, arrMinutes] = flightForm.arrivalTime.split(":").map(Number);
      const depTime = depHours * 60 + depMinutes;
      const arrTime = arrHours * 60 + arrMinutes;
      if (arrTime <= depTime) newErrors.arrivalTime = "Arrival time must be after departure time";
    }

    if (flightForm.transitCity && !flightForm.transitDuration) {
      newErrors.transitDuration = "Transit duration is required when transit city is set";
    }
    if (flightForm.transitDuration && !flightForm.transitCity) {
      newErrors.transitCity = "Transit city is required when transit duration is set";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightForm({ ...flightForm, [name]: value });
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    const flightData = {
      from: flightForm.from,
      to: flightForm.to,
      date: flightForm.date,
      departureTime: flightForm.departureTime,
      arrivalTime: flightForm.arrivalTime,
      price: parseFloat(flightForm.price),
      airline: flightForm.airline,
      ...(flightForm.transitCity && flightForm.transitDuration && {
        transit: { transitCity: flightForm.transitCity, transitDuration: flightForm.transitDuration },
      }),
    };

    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:3000/api/flights", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(flightData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add flight");
      }

      Swal.fire({
        icon: "success",
        title: "Flight Added",
        text: `Flight from ${flightForm.from} to ${flightForm.to} has been successfully added!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setFlightForm({
        from: "", to: "", date: "", returnDate: "", departureTime: "", arrivalTime: "", price: "", airline: "", transitCity: "", transitDuration: "",
      });
      setErrors({});
      setShowErrors(false);

      const flightsResponse = await fetch("http://localhost:3000/api/flights");
      if (flightsResponse.ok) {
        const flightsData = await flightsResponse.json();
        setAirlines([...new Set(flightsData.map((flight) => flight.airline).filter(Boolean))]);
      }
      if (onFlightAdded) onFlightAdded();
    } catch (error) {
      console.error("Error adding flight:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to add flight. Please try again.",
      });
    }
  };

  if (loadingCities || loadingAirlines) return <div>Loading data...</div>;
  if (cityError) return <div>Error fetching cities: {cityError}</div>;
  if (airlineError) return <div>Error fetching airlines: {airlineError}</div>;

  return (
    <div className={styles.dashboardFlightContainer}>
      <h1 className={styles.headerTitle}>Add New Flight</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleFlightSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label className={styles.formLabel}>From</label>
             <input
  type="text"
  name="from"
  value={flightForm.from}
  onChange={handleFlightChange}
  className={`${styles.formControl} ${showErrors && errors.from ? styles.isInvalid : ""}`}
  placeholder="Enter origin city"
/>

              {showErrors && errors.from && <div className={styles.invalidFeedback}>{errors.from}</div>}
            </div>

            <div className="col-md-6">
              <label className={styles.formLabel}>To</label>
             <input
  type="text"
  name="to"
  value={flightForm.to}
  onChange={handleFlightChange}
  className={`${styles.formControl} ${showErrors && errors.to ? styles.isInvalid : ""}`}
  placeholder="Enter destination city"
/>

              {showErrors && errors.to && <div className={styles.invalidFeedback}>{errors.to}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className={styles.formLabel}>Departure Date</label>
              <input
                type="date"
                name="date"
                value={flightForm.date}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.date ? styles.isInvalid : ""}`}
              />
              {showErrors && errors.date && <div className={styles.invalidFeedback}>{errors.date}</div>}
            </div>

            {/* <div className="col-md-6">
              <label className={styles.formLabel}>Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={flightForm.returnDate}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.returnDate ? styles.isInvalid : ""}`}
              />
              {showErrors && errors.returnDate && <div className={styles.invalidFeedback}>{errors.returnDate}</div>}
            </div> */}
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className={styles.formLabel}>Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={flightForm.departureTime}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.departureTime ? styles.isInvalid : ""}`}
              />
              {showErrors && errors.departureTime && <div className={styles.invalidFeedback}>{errors.departureTime}</div>}
            </div>

            <div className="col-md-6">
              <label className={styles.formLabel}>Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={flightForm.arrivalTime}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.arrivalTime ? styles.isInvalid : ""}`}
              />
              {showErrors && errors.arrivalTime && <div className={styles.invalidFeedback}>{errors.arrivalTime}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className={styles.formLabel}>Price ($)</label>
              <input
                type="number"
                name="price"
                value={flightForm.price}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.price ? styles.isInvalid : ""}`}
                min="0"
                step="0.01"
              />
              {showErrors && errors.price && <div className={styles.invalidFeedback}>{errors.price}</div>}
            </div>

            <div className="col-md-6">
              <label className={styles.formLabel}>Airline</label>
              <select
                name="airline"
                value={flightForm.airline}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.airline ? styles.isInvalid : ""}`}
              >
                <option value="">Select Airline</option>
                {airlines.map((airline) => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
              {showErrors && errors.airline && <div className={styles.invalidFeedback}>{errors.airline}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className={styles.formLabel}>Transit City (Optional)</label>
              <input
                type="text"
                name="transitCity"
                value={flightForm.transitCity}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.transitCity ? styles.isInvalid : ""}`}
                placeholder="e.g., Istanbul"
              />
              {showErrors && errors.transitCity && <div className={styles.invalidFeedback}>{errors.transitCity}</div>}
            </div>

            <div className="col-md-6">
              <label className={styles.formLabel}>Transit Duration (Optional)</label>
              <input
                type="text"
                name="transitDuration"
                value={flightForm.transitDuration}
                onChange={handleFlightChange}
                className={`${styles.formControl} ${showErrors && errors.transitDuration ? styles.isInvalid : ""}`}
                placeholder="e.g., 2h 30m"
              />
              {showErrors && errors.transitDuration && <div className={styles.invalidFeedback}>{errors.transitDuration}</div>}
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>Add Flight</button>
        </form>
      </div>
    </div>
  );
}