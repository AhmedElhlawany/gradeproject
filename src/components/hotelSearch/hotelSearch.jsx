import React, { useEffect, useState } from "react";
import { Hotel, MapPin, Users, Star, Wifi, Car, Coffee } from "lucide-react";
import style from "./hotelSearch.module.css";
const HotelBooking = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/hotels")
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setFilteredHotels(data);
      })
      .catch((error) => {
        console.error("Failed to fetch hotels:", error);
      });
  }, []);

  const handleCitySearch = (city) => {
    setSelectedCity(city);
    if (city) {
      const filtered = hotels.filter((hotel) =>
        hotel.city.toLowerCase().includes(city.toLowerCase())
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  };

  const cities = Array.from(new Set(hotels.map((hotel) => hotel.city)));
  const getRandomRating = () => (4.0 + Math.random() * 1.0).toFixed(1);
  const getRandomAmenities = () => {
    const amenities = [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Car, name: "Parking" },
      { icon: Coffee, name: "Restaurant" },
      { icon: Users, name: "Gym" },
    ];
    return amenities.slice(0, 2 + Math.floor(Math.random() * 2));
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5 mt-5">
          <h2 className="display-4 fw-bold">
            Comfortable <span className={`${style.mainColor}`}>Hotels</span>
          </h2>
          <p className="lead text-secondary">
            Find the perfect accommodation for your stay. From luxury resorts to budget-friendly options.
          </p>
        </div>

        {/* City Filter */}
        <div className="card mb-5 rounded-4 shadow-sm border-0 mx-auto p-2" style={{ maxWidth: "600px" }}>
          <div className="card-header border-0 bg-white fs-4 fw-semibold d-flex align-items-center gap-2">
            <MapPin className={`${style.icon}`} /> Search Hotels by City
          </div>
          <div className="card-body">
            <div className="d-flex gap-3 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city name"
                value={selectedCity}
                onChange={(e) => handleCitySearch(e.target.value)}
              />
              <button className={`btn ${style.mainColor} ${style.showBtn}`}  onClick={() => handleCitySearch("")}>Show All</button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {cities.map((city) => (
                <span
                  key={city}
                  className={`badge rounded-pill ${selectedCity === city ? `${style.mainBackground}` : `${style.secBackground}`} cursor-pointer`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCitySearch(city)}  
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Results */}
        <div className="row g-4">
          {filteredHotels.map((hotel) => {
            const amenities = getRandomAmenities();

            return (
              <div key={hotel.id} className="col-md-6 col-lg-4 border-1 overflow-hidden p-3 ">
                <div className="card h-100 shadow-sm border-1 overflow-hidden">
                  <div className="overflow-hidden  position-relative" style={{ height: "200px" }}>
                    <img src={hotel.image} className="w-100 " style={{ height: "100%"}} alt="" />
                      <span className="badge bg-light opacity-50 text-dark position-absolute top-0 end-0 m-2">
                      {hotel.availableRooms} Rooms
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title fw-bold">{hotel.name}</h5>
                    <div>
                        <h5 className={`${style.mainColor} mb-0`}>${hotel.price}</h5>
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
                      {amenities.map((a, index) => (
                        <span key={index} className={`${style.mainColor} badge bg-light fw-normal border`}>
                          <a.icon size={16} className="me-1" /> {a.name}
                        </span>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      
                      <button className={`btn ${style.bookBtn}`}>Book Now</button>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHotels.length === 0 && (
          <div className="card text-center mt-5 py-5">
            <div className="card-body">
              <Hotel className="text-muted mb-3" size={48} />
              <h5>No hotels found</h5>
              <p className="text-muted">Try searching for a different city.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelBooking;
