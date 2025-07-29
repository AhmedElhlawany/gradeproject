import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./ViewHotels.module.css";
import Swal from "sweetalert2";
import EditHotelModal from "../EditHotelsModal/EditHotelModal";

export default function ViewHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels");
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId, hotelName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete  ${hotelName}? `,
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

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) return <div className={styles.loading}>Loading hotels...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (hotels.length === 0) return <div className={styles.empty}>No hotels available.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Available Hotels</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.hotelTable}>
          <thead>
            <tr>
              <th className={styles.thName}>Name</th>
              <th className={styles.thCity}>City</th>
              <th className={styles.thRate}>Rate</th>
              <th className={styles.thOnSale}>On Sale</th>
              <th className={styles.thPhone}>Contact Phone</th>
              <th className={styles.thEmail}>Contact Email</th>
              <th className={styles.thAmenities}>Amenities</th>
              <th className={styles.thRooms}>Rooms</th>
              <th className={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.city}</td>
                <td>{hotel.rate}</td>
                <td>{hotel.onSale ? "Yes" : "No"}</td>
                <td>{hotel.contact.phone}</td>
                <td>{hotel.contact.email}</td>
                <td>{hotel.amenities.join(", ")}</td>
                <td>
                  {hotel.availableRooms
                    .map((room) => `Type: ${room.type}, Quantity: ${room.quantity}, Price: $${room.price}`)
                    .join("; ")}
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