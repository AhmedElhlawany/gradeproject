import React, { useState, useEffect } from "react";
import styles from "./ViewFlights.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditFlightModal from "../EditFlightModal/EditFlightModal";
import Swal from "sweetalert2";

export default function ViewFlights({ onFlightAdded }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const fetchFlights = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/flights");
      if (!response.ok) {
        throw new Error(`Failed to fetch flights: ${response.status}`);
      }
      const data = await response.json();
      console.log("Flights fetched:", data);
      const uniqueFlights = [...new Map(data.map(flight => [flight.id, flight])).values()];
      setFlights(uniqueFlights);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    if (onFlightAdded) {
      fetchFlights();
    }
  }, [onFlightAdded]);

  const handleDelete = async (flightId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete Flight ${flightId}? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/flights/${flightId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete flight: ${response.status}`);
        }
        console.log(`Flight ${flightId} deleted successfully`);
        await fetchFlights();
        Swal.fire({
          icon: "success",
          title: "Flight Deleted",
          text: `Flight ${flightId} has been successfully deleted!`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting flight:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to delete flight: ${err.message}`,
        });
      }
    }
  };

  const handleEdit = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFlight(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/flights/${selectedFlight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update flight: ${response.status}`);
      }
      console.log(`Flight ${selectedFlight.id} updated successfully`);
      await fetchFlights();
      handleModalClose();
      Swal.fire({
        icon: "success",
        title: "Flight Updated",
        text: `Flight ${selectedFlight.id} has been successfully updated!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating flight:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update flight: ${err.message}`,
      });
    }
  };

  if (loading) return <div className={styles.loading}>Loading flights...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (flights.length === 0) return <div className={styles.empty}>No flights available.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Available Flights</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.flightTable}>
          <thead>
            <tr>
              <th className={styles.thAirline}>Airline</th>
              <th className={styles.thFlightNumber}>Flight Number</th>
              <th className={styles.thFrom}>From</th>
              <th className={styles.thTo}>To</th>
              <th className={styles.thDeparture}>Departure</th>
              <th className={styles.thArrival}>Arrival</th>
              <th className={styles.thDate}>Date</th>
              <th className={styles.thReturnDate}>Return Date</th>
              <th className={styles.thPrice}>Price</th>
              <th className={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => (
              <tr key={flight.id}>
                <td>{flight.airline}</td>
                <td>{`Flight ${index + 1}`}</td>
                <td>{flight.from}</td>
                <td>{flight.to}</td>
                <td>{flight.departureTime}</td>
                <td>{flight.arrivalTime}</td>
                <td>{flight.date}</td>
                <td>{flight.returnDate || "N/A"}</td>
                <td>${flight.price}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(flight)}
                    title="Edit Flight"
                  >
                    <FaEdit className={styles.editIcon} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(flight.id)}
                    title="Delete Flight"
                  >
                    <FaTrash className={styles.deleteIcon} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <EditFlightModal
          flight={selectedFlight}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}