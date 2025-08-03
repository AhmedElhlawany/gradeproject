import React, { useState } from "react";
import styles from "./FavoriteHotelCard.module.css"; // Reusing flight card styles for consistency
import { Hotel, MapPin, Star, Heart } from "lucide-react";

export default function FavoriteHotelCard({ hotel, onRemove, onBook }) {
  const [isHovered, setIsHovered] = useState(false);

  // Safely access price, with fallback if availableRooms is undefined or empty
  const price = hotel.availableRooms && hotel.availableRooms.length > 0 
    ? hotel.availableRooms[0].price 
    : "N/A";

  return (
    <div className={`${styles.card} d-flex flex-column  rounded-3 overflow-hidden shadow`}>
      <div className="overflow-hidden position-relative w-100" style={{ height: "200px" }}>
        <img src={hotel.image || "/placeholder.jpg"} className="w-100" style={{ height: "100%" }} alt={hotel.name || "Hotel"} />
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{hotel.name || "Unknown Hotel"}</h5>
          <button
            className={` ${styles['favoriteBtn']}`}
            onClick={() => onRemove(hotel.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Heart
              className={styles.favoriteIcon}
              fill={isHovered ? "none" : "#00c3ff"}
              color={isHovered ? "#00c3ff" : "#00c3ff"}
            />
          </button>
        </div>
        <div className="mb-2 d-flex align-items-center gap-2">
          <MapPin size={16} color="#00c3ff"/>
          <small>{hotel.city || "Unknown City"}</small>
        </div>
        <div className="mb-2 d-flex align-items-center gap-2">
          <Star size={16} fill="gold" color="gold" />
          <small>{hotel.rate || "N/A"}</small>
          <small>(150 reviews)</small>
        </div>
       
        <div className="d-flex flex-wrap gap-2 mb-3">
          {(hotel.amenities || []).map((a, index) => (
            <span key={index} className="badge bg-light fw-medium border">
              {a}
            </span>
          ))}
        </div>
        <div className="d-flex justify-content-center">
          <button className={`${styles['bookBtn']}`} onClick={onBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}