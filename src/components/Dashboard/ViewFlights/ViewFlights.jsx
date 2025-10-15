import React, { useState, useEffect } from "react";
import styles from "./ViewFlights.module.css";
import { FaEdit, FaTrash, FaFilter, FaTimes } from "react-icons/fa";
import EditFlightModal from "../EditFlightModal/EditFlightModal";
import Swal from "sweetalert2";

export default function ViewFlights({ onFlightAdded }) {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filters, setFilters] = useState({
    airline: "",
    flightNumber: "",
    from: "",
    to: "",
    date: "",
    minPrice: "",
    maxPrice: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchFlights = async () => {
    try {
      const response = await fetch("https://flyhigh.zeabur.app/api/flights");
      if (!response.ok) {
        throw new Error(`Failed to fetch flights: ${response.status}`);
      }
      const data = await response.json();
      console.log("Flights fetched:", data);
      const uniqueFlights = [...new Map(data.map(flight => [flight.id, flight])).values()];
      const flightsWithIndex = uniqueFlights.map((flight, index) => ({
        ...flight,
        originalIndex: index
      }));
      setFlights(flightsWithIndex);
      setFilteredFlights(flightsWithIndex);
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

  useEffect(() => {
    const applyFilters = () => {
      let result = [...flights];

      if (filters.airline) {
        result = result.filter(flight => 
          flight.airline?.toLowerCase().includes(filters.airline.toLowerCase())
        );
      }

      if (filters.flightNumber) {
        const flightNumber = parseInt(filters.flightNumber, 10);
        if (!isNaN(flightNumber)) {
          result = result.filter(flight => flight.originalIndex + 1 === flightNumber);
        }
      }

      if (filters.from) {
        result = result.filter(flight => 
          flight.from?.toLowerCase().includes(filters.from.toLowerCase())
        );
      }

      if (filters.to) {
        result = result.filter(flight => 
          flight.to.toLowerCase().includes(filters.to.toLowerCase())
        );
      }

      if (filters.date) {
        result = result.filter(flight => 
          flight.date.includes(filters.date)
        );
      }

      if (filters.minPrice) {
        result = result.filter(flight => 
          flight.price >= parseFloat(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        result = result.filter(flight => 
          flight.price <= parseFloat(filters.maxPrice)
        );
      }

      setFilteredFlights(result);
    };

    applyFilters();
  }, [filters, flights]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearInput = (name) => {
    setFilters(prev => ({ ...prev, [name]: "" }));
  };

  const clearFilters = () => {
    setFilters({
      airline: "",
      // flightNumber: "",
      from: "",
      to: "",
      date: "",
      minPrice: "",
      maxPrice: ""
    });
  };

  const handleDelete = async (flightId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete Flight ${flightId}? `,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
       customClass: {
                confirmButton: `btn ${styles['conbtn']}`,
              }
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://flyhigh.zeabur.app/api/flights/${flightId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
           customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
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

      const response = await fetch(`https://flyhigh.zeabur.app/api/flights/${selectedFlight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"
,
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
         },

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

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.headerTitle}>Available Flights</h1>
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
                  <label htmlFor="airline" className={styles.filterLabel}>Airline</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="airline"
                      name="airline"
                      placeholder="Filter by Airline"
                      value={filters.airline}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.airline && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("airline")}
                        aria-label="Clear Airline Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
               
                <div className={styles.filterItem}>
                  <label htmlFor="from" className={styles.filterLabel}>From</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      placeholder="Filter by Departure City"
                      value={filters.from}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.from && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("from")}
                        aria-label="Clear Departure City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="to" className={styles.filterLabel}>To</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      placeholder="Filter by Destination City"
                      value={filters.to}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.to && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("to")}
                        aria-label="Clear Destination City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={strings.filterItem}>
                  <label htmlFor="date" className={styles.filterLabel}>Date</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      placeholder="Filter by Date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className={styles.dateInput}
                    />
                    {filters.date && (
                      <button
                        type="button"
                        className={styles.clearDateButton}
                        onClick={() => handleClearInput("date")}
                        aria-label="Clear Date Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="minPrice" className={styles.filterLabel}>Min Price</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.minPrice && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("minPrice")}
                        aria-label="Clear Min Price Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="maxPrice" className={styles.filterLabel}>Max Price</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.maxPrice && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("maxPrice")}
                        aria-label="Clear Max Price Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        <div className={styles.loading}>Loading flights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.headerTitle}>Available Flights</h1>
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
                  <label htmlFor="airline" className={styles.filterLabel}>Airline</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="airline"
                      name="airline"
                      placeholder="Filter by Airline"
                      value={filters.airline}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.airline && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("airline")}
                        aria-label="Clear Airline Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
               
                <div className={styles.filterItem}>
                  <label htmlFor="from" className={styles.filterLabel}>From</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="from"
                      name="from"
                      placeholder="Filter by Departure City"
                      value={filters.from}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.from && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("from")}
                        aria-label="Clear Departure City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="to" className={styles.filterLabel}>To</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="to"
                      name="to"
                      placeholder="Filter by Destination City"
                      value={filters.to}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.to && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("to")}
                        aria-label="Clear Destination City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="date" className={styles.filterLabel}>Date</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      placeholder="Filter by Date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className={styles.dateInput}
                    />
                    {filters.date && (
                      <button
                        type="button"
                        className={styles.clearDateButton}
                        onClick={() => handleClearInput("date")}
                        aria-label="Clear Date Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="minPrice" className={styles.filterLabel}>Min Price</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.minPrice && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("minPrice")}
                        aria-label="Clear Min Price Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="maxPrice" className={styles.filterLabel}>Max Price</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.maxPrice && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("maxPrice")}
                        aria-label="Clear Max Price Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Available Flights</h1>
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
                <label htmlFor="airline" className={styles.filterLabel}>Airline</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="airline"
                    name="airline"
                    placeholder="Filter by Airline"
                    value={filters.airline}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.airline && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("airline")}
                      aria-label="Clear Airline Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className={styles.filterItem}>
                <label htmlFor="from" className={styles.filterLabel}>From</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    placeholder="Filter by Departure City"
                    value={filters.from}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.from && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("from")}
                      aria-label="Clear Departure City Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="to" className={styles.filterLabel}>To</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    placeholder="Filter by Destination City"
                    value={filters.to}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.to && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("to")}
                      aria-label="Clear Destination City Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="date" className={styles.filterLabel}>Date</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Filter by Date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className={styles.dateInput}
                  />
                  {filters.date && (
                    <button
                      type="button"
                      className={styles.clearDateButton}
                      onClick={() => handleClearInput("date")}
                      aria-label="Clear Date Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="minPrice" className={styles.filterLabel}>Min Price</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.minPrice && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("minPrice")}
                      aria-label="Clear Min Price Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="maxPrice" className={styles.filterLabel}>Max Price</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.maxPrice && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("maxPrice")}
                      aria-label="Clear Max Price Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              className={styles.clearButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <div className={styles.tableWrapper}>
        {filteredFlights.length === 0 ? (
          <div className={styles.empty}>No flights available for the selected filters.</div>
        ) : (
          <table className={styles.flightTable}>
            <thead>
              <tr>
                                <th className={styles.thFlightNumber}>#</th>

                <th className={styles.thAirline}>Airline</th>
                <th className={styles.thFrom}>From</th>
                <th className={styles.thTo}>To</th>
                <th className={styles.thDeparture}>Departure</th>
                <th className={styles.thArrival}>Arrival</th>
                <th className={styles.thDate}>Date</th>
                <th className={styles.thPrice}>Price</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.slice(1).map((flight) => (
                <tr key={flight.id}>
                                    <td>{` ${flight.originalIndex}`}</td>

                  <td>{flight.airline}</td>
                  <td>{flight.from}</td>
                  <td>{flight.to}</td>
                  <td>{flight.departureTime}</td>
                  <td>{flight.arrivalTime}</td>
                  <td>{flight.date}</td>
                  <td>${flight.price}</td>
                  <td>
                   
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
        )}
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