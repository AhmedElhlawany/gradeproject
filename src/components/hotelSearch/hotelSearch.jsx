import React, { useEffect, useState, useContext } from "react";
import { Hotel, MapPin, Star, Heart } from "lucide-react";
import Swal from "sweetalert2";
import style from "./hotelSearch.module.css";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import { FavoritesContext } from "../Context/FavouriteContext";

const HotelBooking = () => {
  const { bookedHotel, setBookedHotel } = useContext(FlightContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://flyhigh.zeabur.app/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setFilteredHotels(data);
      })
      .catch((error) => {
        console.error("Failed to fetch hotels:", error);
      });
  }, []);

  useEffect(() => {
    let filtered = hotels;

    if (selectedCity) {
      filtered = filtered.filter((hotel) =>
        hotel.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (hotel) =>
        hotel.availableRooms[0].price >= priceRange[0] &&
        hotel.availableRooms[0].price <= priceRange[1] &&
        hotel.rate >= minRating &&
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
    );

    setFilteredHotels(filtered);
  }, [selectedCity, priceRange, minRating, selectedAmenities, hotels]);

  const handleCitySearch = (city) => {
    setSelectedCity(city);
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleToggleFavorite = async (hotel) => {
    if(! localStorage.getItem("token")) 
    {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to perform this action.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: `btn ${style['conbtn']}`,
        },
        buttonsStyling: false,
      });
      return;
    }
    try {
      await toggleFavorite({ ...hotel, type: "hotel" });
      const isFavorited = favorites.some((f) => f.id === hotel.id && f.type === "hotel");
      Swal.fire({
        icon: isFavorited ? "info" : "success",
        title: isFavorited ? "Removed from Favorites" : " Added to Favorites!",
        text: isFavorited
          ? `${hotel.name} has been removed from your favorites.`
          : `${hotel.name} has been added to your favorites.`,
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: `btn ${style['conbtn']}`,
        },
        buttonsStyling: false,
      });
    } catch (err) {
      console.error("Error toggling favorite:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update favorites. Please try again.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
          confirmButton: `btn ${style['conbtn']}`,
        },
        buttonsStyling: false,
      });
    }
  };

  const handleBooking = (hotel) => {
    setBookedHotel(hotel);
    navigate(`/hotelDetails/${hotel.id}`);
  };

  const cities = Array.from(new Set(hotels.map((hotel) => hotel.city)));
  const amenities = Array.from(
    new Set(hotels.flatMap((hotel) => hotel.amenities))
  );

  return (
    <section className="py-5 bg-light">
      <div className="container-fluid">
        <div className="text-center mb-5 mt-5">
          <h2 className="display-4 fw-bold">
            Comfortable <span className={`${style.mainColor}`}>Hotels</span>
          </h2>
          <p className="lead text-secondary">
            Find the perfect accommodation for your stay. From luxury resorts to budget-friendly options.
          </p>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="card rounded-4 shadow-sm border-0 p-2" style={{ top: "20px" }}>
              <div className="card-header border-0 bg-white fs-4 fw-semibold d-flex align-items-center gap-2">
                <MapPin className={`${style.icon}`} /> Hotel Filters
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label fw-semibold">Search by City</label>
                  <div className="d-flex gap-3 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city name"
                      value={selectedCity}
                      onChange={(e) => handleCitySearch(e.target.value)}
                    />
                    <button
                      className={`btn ${style.mainColor} ${style.showBtn}`}
                      onClick={() => handleCitySearch("")}
                    >
                      Show All
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <span
                        key={city}
                        className={`badge rounded-pill ${
                          selectedCity === city ? `${style.mainBackground}` : `${style.secBackground}`
                        } cursor-pointer`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCitySearch(city)}
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
                  <div className="d-flex flex-column gap-3">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    />
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Minimum Rating ({minRating})</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(+e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Amenities</label>
                  <div className="d-flex flex-column gap-2">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          id={`amenity-${amenity}`}
                        />
                        <label className="form-check-label text-dark" htmlFor={`amenity-${amenity}`}>
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-8">
            <div className="row g-4">
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className="col-md-6 col-lg-4 border-0 overflow-hidden p-3 position-relative">
                  <div className="card h-100 shadow-sm border-0 overflow-hidden">
                    <div className="overflow-hidden position-relative" style={{ height: "200px" }}>
                      <img src={hotel.image} className="w-100" style={{ height: "100%" }} alt={hotel.name} />
                      <button
                        className="position-absolute top-0 end-0 m-2 bg-transparent border-0"
                        onClick={() => handleToggleFavorite(hotel)}
                      >
                        <Heart
                          size={24}
                          fill={favorites.some((f) => f.id === hotel.id && f.type === "hotel") ? "#1bcfff" : "none"}
                          color="#1bcfff"
                        />
                      </button>
                    </div>
                    <div className="card-body pb-5 mb-2">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title fw-bold">{hotel.name}</h5>
                        <div>
                          <h5 className={`${style.mainColor} mb-0`}>${hotel.availableRooms[0].price}</h5>
                          <small className="text-muted">per night</small>
                        </div>
                      </div>
                      <div className="mb-2 d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <MapPin className={`${style.mainColor}`} size={16} />
                          <small className="text-muted">{hotel.city}</small>
                        </div>
                      </div>
                      <div className="mb-3 d-flex align-items-center gap-2">
                        <Star className="text-warning" size={16} fill="gold" />
                        <small className="fw-medium">{hotel.rate}</small>
                        <small className="text-muted">({Math.floor(Math.random() * 500) + 50} reviews)</small>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {hotel.amenities.map((a, index) => (
                          <span key={index} className={`${style.mainColor} badge bg-light fw-medium border`}>
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className={`${style.bookdiv} d-flex justify-content-between align-items-center position-absolute`}>
                        <button
                          className={`btn fw-semibold fs-5 ${style.bookBtn}`}
                          onClick={() => handleBooking(hotel)}
                        >
                          See Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="card text-center mt-5 py-5">
                <div className="card-body">
                  <Hotel className="text-muted mb-3" size={48} />
                  <h5>No hotels found</h5>
                  <p className="text-muted">Try adjusting your filters.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelBooking;