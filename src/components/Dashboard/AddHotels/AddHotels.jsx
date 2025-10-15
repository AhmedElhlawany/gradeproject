import React, { useState, useEffect } from "react";
import styles from "./AddHotels.module.css";
import Swal from "sweetalert2";

export default function AddHotels() {
  const [hotelForm, setHotelForm] = useState({
    city: "",
    location: "",
    name: "",
    availableRooms: [{ type: "single", quantity: "", price: "" }],
    onSale: false,
    rate: "",
    image: "",
    description: "",
    amenities: [],
  });
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [cityError, setCityError] = useState(null);
  const [amenityError, setAmenityError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://flyhigh.zeabur.app/api/places");
        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }
        const data = await response.json();
        console.log("Cities fetched:", data);
        const cityList = data.map((item) => item.city);
        setCities(cityList);
        setLoadingCities(false);
      } catch (err) {
        setCityError(err.message);
        setLoadingCities(false);
      }
    };
    const fetchAmenities = async () => {
      try {
        const response = await fetch("https://flyhigh.zeabur.app/api/hotels");
        if (!response.ok) {
          throw new Error(`Failed to fetch hotels: ${response.status}`);
        }
        const data = await response.json();
        console.log("Hotels fetched for amenities:", data);
        const amenitiesList = [...new Set(data.flatMap((hotel) => hotel.amenities || []).filter(Boolean))];
        setAmenities(amenitiesList);
        setLoadingAmenities(false);
      } catch (err) {
        setAmenityError(err.message);
        setLoadingAmenities(false);
      }
    };
    fetchCities();
    fetchAmenities();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!hotelForm.city) newErrors.city = "City is required";
    if (!hotelForm.name) newErrors.name = "Hotel name is required";
    if (!hotelForm.location) newErrors.location = "Google Maps embed URL is required";
    if (!hotelForm.description) newErrors.description = "Description is required";
    if (!hotelForm.image) newErrors.image = "Image filename is required";
    if (!hotelForm.rate) newErrors.rate = "Rate is required";
  
    if (hotelForm.amenities.length === 0) newErrors.amenities = "At least one amenity is required";

    if (hotelForm.rate && (hotelForm.rate < 0 || hotelForm.rate > 5)) {
      newErrors.rate = "Rate must be between 0 and 5";
    }

    if (hotelForm.availableRooms.length === 0) {
      newErrors.availableRooms = "At least one room type is required";
    } else {
      hotelForm.availableRooms.forEach((room, index) => {
        if (!room.type) newErrors[`roomType${index}`] = `Room type is required for room ${index + 1}`;
        if (!room.quantity || room.quantity <= 0) newErrors[`roomQuantity${index}`] = `Quantity must be greater than 0 for room ${index + 1}`;
        if (!room.price || room.price <= 0) newErrors[`roomPrice${index}`] = `Price must be greater than 0 for room ${index + 1}`;
      });
    }

   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHotelChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "onSale") {
      setHotelForm({ ...hotelForm, onSale: checked });
      return;
    } else if (name === "amenities") {
      const updatedAmenities = checked
        ? [...hotelForm.amenities, value]
        : hotelForm.amenities.filter((amenity) => amenity !== value);
      setHotelForm({ ...hotelForm, amenities: updatedAmenities });
      setErrors((prev) => ({ ...prev, amenities: "" }));
    } else {
      setHotelForm({ ...hotelForm, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...hotelForm.availableRooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setHotelForm({ ...hotelForm, availableRooms: updatedRooms });
  };

  const addRoom = () => {
    setHotelForm({
      ...hotelForm,
      availableRooms: [...hotelForm.availableRooms, { type: "", quantity: "", price: "" }],
    });
  };

  const removeRoom = (index) => {
    const updatedRooms = hotelForm.availableRooms.filter((_, i) => i !== index);
    setHotelForm({ ...hotelForm, availableRooms: updatedRooms });
  };

  const refetchAmenities = async () => {
    try {
      const response = await fetch("https://flyhigh.zeabur.app/api/hotels");
      console.log("Refetch amenities response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to refetch hotels: ${response.status}`);
      }
      const data = await response.json();
      console.log("Refetched hotels data:", data);
      const amenitiesList = [...new Set(data.flatMap((hotel) => hotel.amenities || []).filter(Boolean))];
      setAmenities(amenitiesList);
      setAmenityError(null);
    } catch (err) {
      console.error("Refetch amenities error:", err);
      setAmenityError("Hotel added, but failed to update amenities list: " + err.message);
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    if (!formElement) {
      console.error("Form element is null or undefined");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Form submission failed due to an internal error. Please try again.",
      });
      return;
    }

    formElement.classList.add("was-validated");
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    const hotelData = {
      city: hotelForm.city,
      location: hotelForm.location,
      name: hotelForm.name,
      availableRooms: hotelForm.availableRooms.map((room) => ({
        type: room.type,
        quantity: parseInt(room.quantity),
        price: parseFloat(room.price),
      })),
      onSale: hotelForm.onSale,
      rate: parseFloat(hotelForm.rate),
      image: hotelForm.image,
      description: hotelForm.description,
      amenities: hotelForm.amenities,
      
    };

    try {
      console.log("Sending hotel data:", JSON.stringify(hotelData, null, 2));
     const token = localStorage.getItem("token"); // لو انت مخزن التوكن بعد اللوجين

const response = await fetch("https://flyhigh.zeabur.app/api/hotels", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // 👈 مهم
  },
  body: JSON.stringify(hotelData),
});

      console.log("POST response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Failed to add hotel to server: ${response.status} ${errorText || 'No additional error information'}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log("POST response data:", responseData);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Invalid server response format. Please check the server.");
      }

      if (!responseData) {
        throw new Error("Received empty response from server.");
      }

      const hotelName = hotelForm.name;
      const hotelCity = hotelForm.city;

      Swal.fire({
        icon: "success",
        title: "Hotel Added",
        text: `Hotel ${hotelName} in ${hotelCity} has been successfully added!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setHotelForm({
        city: "",
        location: "",
        name: "",
        availableRooms: [{ type: "single", quantity: "", price: "" }],
        onSale: false,
        rate: "",
        image: "",
        description: "",
        amenities: [],
       
      });
      setErrors({});
      formElement.classList.remove("was-validated");
      await refetchAmenities();
    } catch (error) {
      console.error("Error adding hotel:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to add hotel. Please try again.",
      });
    }
  };

  if (loadingCities || loadingAmenities) return <div className={styles.loading}>Loading data...</div>;
  if (cityError) return <div className={styles.error}>Error fetching cities: {cityError}</div>;
  if (amenityError) return <div className={styles.error}>Error fetching amenities: {amenityError}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Add New Hotel</h1>
      <div className={styles.formCard}>
        <form onSubmit={handleHotelSubmit} noValidate className="needs-validation">
          <div className={`${styles.formRow} row`}>
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>City</label>
              <select
                name="city"
                value={hotelForm.city}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.city ? styles.isInvalid : hotelForm.city ? styles.isValid : ""}`}
                required
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>{city}</option>
                ))}
              </select>
              <div className={styles.invalidFeedback}>{errors.city}</div>
            </div>
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>Hotel Name</label>
              <input
                type="text"
                name="name"
                value={hotelForm.name}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.name ? styles.isInvalid : hotelForm.name ? styles.isValid : ""}`}
                required
              />
              <div className={styles.invalidFeedback}>{errors.name}</div>
            </div>
          </div>
          <div className={`${styles.formRow} row`}>
            <div className="col-md-12 mb-3">
              <label className={styles.formLabel}>Google Maps Embed URL</label>
              <input
                type="url"
                name="location"
                value={hotelForm.location}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.location ? styles.isInvalid : hotelForm.location ? styles.isValid : ""}`}
                required
              />
              <div className={styles.invalidFeedback}>{errors.location}</div>
            </div>
          </div>
          <div className={`${styles.formRow} row`}>
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>Rate (0-5)</label>
              <input
                type="number"
                name="rate"
                value={hotelForm.rate}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.rate ? styles.isInvalid : hotelForm.rate ? styles.isValid : ""}`}
                required
                min="0"
                max="5"
                step="0.1"
              />
              <div className={styles.invalidFeedback}>{errors.rate}</div>
            </div>
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>Image Filename</label>
              <input
                type="text"
                name="image"
                value={hotelForm.image}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.image ? styles.isInvalid : hotelForm.image ? styles.isValid : ""}`}
                required
                placeholder="e.g., HotelName.jpg"
              />
              <div className={styles.invalidFeedback}>{errors.image}</div>
            </div>
          </div>
          <div className={`${styles.formRow} row`}>
            <div className="col-md-12 mb-3">
              <label className={styles.formLabel}>Description</label>
              <textarea
                name="description"
                value={hotelForm.description}
                onChange={handleHotelChange}
                className={`${styles.formControl} ${errors.description ? styles.isInvalid : hotelForm.description ? styles.isValid : ""}`}
                required
                rows="4"
              />
              <div className={styles.invalidFeedback}>{errors.description}</div>
            </div>
          </div>
        
          <div className={`${styles.formRow} row`}>
            <div className="col-md-12 mb-3">
              <label className={styles.formLabel}>Amenities</label>
              <div className={`${styles.amenitiesContainer} ${errors.amenities ? styles.isInvalid : hotelForm.amenities.length > 0 ? styles.isValid : ""}`}>
                {amenities.map((amenity) => (
                  <div key={amenity} className={styles.amenityItem}>
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={hotelForm.amenities.includes(amenity)}
                      onChange={handleHotelChange}
                      className={styles.checkboxInput}
                      id={`amenity-${amenity}`}
                    />
                    <label htmlFor={`amenity-${amenity}`} className={styles.checkboxLabel}>{amenity}</label>
                  </div>
                ))}
              </div>
              <div className={styles.invalidFeedback}>{errors.amenities}</div>
            </div>
          </div>
         
          <div className={`${styles.formRow} row`}>
            <div className="col-md-12 mb-3">
              <label className={styles.formLabel}>Available Rooms</label>
              {hotelForm.availableRooms.map((room, index) => (
                <div key={index} className={`${styles.roomRow} row mb-2`}>
                  <div className="col-md-4">
                    <select
                      value={room.type}
                      onChange={(e) => handleRoomChange(index, "type", e.target.value)}
                      className={styles.formControl}
                      required
                    >
                      <option value="">Select Room Type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="suite">Suite</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      value={room.quantity}
                      onChange={(e) => handleRoomChange(index, "quantity", e.target.value)}
                      className={styles.formControl}
                      placeholder="Quantity"
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleRoomChange(index, "price", e.target.value)}
                      className={styles.formControl}
                      placeholder="Price ($)"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-2">
                    {hotelForm.availableRooms.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeRoom(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {errors.availableRooms && <div className={styles.invalidFeedback}>{errors.availableRooms}</div>}
              <button type="button" className={styles.addRoomButton} onClick={addRoom}>
                Add Room Type
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Add Hotel</button>
        </form>
      </div>
    </div>
  );
}