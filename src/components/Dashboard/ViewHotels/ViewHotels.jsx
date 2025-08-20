import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaFilter, FaTimes } from "react-icons/fa";
import styles from "./ViewHotels.module.css";
import Swal from "sweetalert2";
import EditHotelModal from "../EditHotelsModal/EditHotelModal";

export default function ViewHotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    rate: "",
    phone: "",
    email: "",
    amenities: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels");
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      const data = await response.json();
      const validHotels = data.filter(hotel => 
        Array.isArray(hotel.availableRooms) && 
        hotel.availableRooms.length > 0 && 
        typeof hotel.availableRooms[0].price === 'number' && 
        !isNaN(hotel.availableRooms[0].price)
      );
      setHotels(validHotels);
      setFilteredHotels(validHotels);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...hotels];

      if (filters.name) {
        result = result.filter(hotel =>
          hotel.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.city) {
        result = result.filter(hotel =>
          hotel.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      if (filters.rate) {
        const rate = parseFloat(filters.rate);
        if (!isNaN(rate)) {
          result = result.filter(hotel => Math.abs(hotel.rate - rate) < 0.1);
        }
      }

   

      if (filters.amenities) {
        result = result.filter(hotel =>
          hotel.amenities.some(amenity =>
            amenity.toLowerCase().includes(filters.amenities.toLowerCase())
          )
        );
      }

      setFilteredHotels(result);
    };

    applyFilters();
  }, [filters, hotels]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      city: "",
      rate: "",
    
      amenities: ""
    });
  };

  const handleClearInput = (name) => {
    setFilters(prev => ({ ...prev, [name]: "" }));
  };

  const handleDelete = async (hotelId, hotelName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${hotelName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete hotel");
        }
        setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
        setFilteredHotels(filteredHotels.filter((hotel) => hotel.id !== hotelId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${hotelName} has been deleted.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete hotel. Please try again.",
           customClass: {
                    confirmButton: `btn ${styles['conbtn']}`,
                  }
        });
      }
    }
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchHotels();
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.headerTitle}>Available Hotels</h1>
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
                  <label htmlFor="name" className={styles.filterLabel}>Name</label>
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
                  <label htmlFor="city" className={styles.filterLabel}>City</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Filter by City"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.city && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("city")}
                        aria-label="Clear City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="rate" className={styles.filterLabel}>Rate</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="rate"
                      name="rate"
                      placeholder="Filter by Rate"
                      value={filters.rate}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    {filters.rate && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("rate")}
                        aria-label="Clear Rate Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
              
                <div className={styles.filterItem}>
                  <label htmlFor="amenities" className={styles.filterLabel}>Amenities</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="amenities"
                      name="amenities"
                      placeholder="Filter by Amenities"
                      value={filters.amenities}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.amenities && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("amenities")}
                        aria-label="Clear Amenities Filter"
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
        <div className={styles.loading}>Loading hotels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.headerTitle}>Available Hotels</h1>
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
                  <label htmlFor="name" className={styles.filterLabel}>Name</label>
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
                  <label htmlFor="city" className={styles.filterLabel}>City</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Filter by City"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.city && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("city")}
                        aria-label="Clear City Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <label htmlFor="rate" className={styles.filterLabel}>Rate</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      id="rate"
                      name="rate"
                      placeholder="Filter by Rate"
                      value={filters.rate}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    {filters.rate && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("rate")}
                        aria-label="Clear Rate Filter"
                      >
                        <FaTimes className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>
               
                <div className={styles.filterItem}>
                  <label htmlFor="amenities" className={styles.filterLabel}>Amenities</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="amenities"
                      name="amenities"
                      placeholder="Filter by Amenities"
                      value={filters.amenities}
                      onChange={handleFilterChange}
                      className={styles.filterInput}
                    />
                    {filters.amenities && (
                      <button
                        type="button"
                        className={styles.clearInputButton}
                        onClick={() => handleClearInput("amenities")}
                        aria-label="Clear Amenities Filter"
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
      <h1 className={styles.headerTitle}>Available Hotels</h1>
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
                <label htmlFor="name" className={styles.filterLabel}>Name</label>
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
                <label htmlFor="city" className={styles.filterLabel}>City</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Filter by City"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.city && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("city")}
                      aria-label="Clear City Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.filterItem}>
                <label htmlFor="rate" className={styles.filterLabel}>Rate</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    placeholder="Filter by Rate"
                    value={filters.rate}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  {filters.rate && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("rate")}
                      aria-label="Clear Rate Filter"
                    >
                      <FaTimes className={styles.clearIcon} />
                    </button>
                  )}
                </div>
              </div>
 
              <div className={styles.filterItem}>
                <label htmlFor="amenities" className={styles.filterLabel}>Amenities</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="amenities"
                    name="amenities"
                    placeholder="Filter by Amenities"
                    value={filters.amenities}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                  />
                  {filters.amenities && (
                    <button
                      type="button"
                      className={styles.clearInputButton}
                      onClick={() => handleClearInput("amenities")}
                      aria-label="Clear Amenities Filter"
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
        {filteredHotels.length === 0 ? (
          <div className={styles.empty}>No hotels available for the selected filters.</div>
        ) : (
          <table className={styles.hotelTable}>
            <thead>
              <tr>
                <th className={styles.thName}>Name</th>
                <th className={styles.thCity}>City</th>
                <th className={styles.thRate}>Rate</th>
                
                <th className={styles.thAmenities}>Amenities</th>
                <th className={styles.thRooms}>Rooms</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>{hotel.rate}</td>
                 
                  <td>{hotel.amenities.join(", ")}</td>
                  <td>
                    {hotel.availableRooms
                      .map((room) => <li className="list-unstyled">Type: ${room.type}, Quantity: ${room.quantity}, Price: ${room.price}</li>
                    
                    )
                      }
                  </td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(hotel)}
                      title="Edit Hotel"
                    >
                      <FaEdit className={styles.editIcon} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(hotel.id, hotel.name)}
                      title="Delete Hotel"
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
      {isModalOpen && selectedHotel && (
        <EditHotelModal
          hotel={selectedHotel}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}