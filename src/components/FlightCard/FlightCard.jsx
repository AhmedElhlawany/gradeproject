import React, { useState, useEffect } from "react";
import styles from "./FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaRegHeart, FaHeart } from "react-icons/fa";

export default function FlightCard({
  airline = "Emirates",
  flightNumber = "Flight #1",
  from = "Cairo",
  to = "Dubai",
  departureTime = "09:00",
  arrivalTime = "13:30",
  date = "2025-07-20",
  price = 350,
  onBook,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favoriteFlights") || "[]");
      return favorites.some(flight => flight.flightNumber === flightNumber);
    } catch (error) {
      console.error("Error reading favoriteFlights from localStorage:", error);
      return false;
    }
  });

  const handleFavoriteToggle = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favoriteFlights") || "[]");
      if (isFavorited) {
        const updatedFavorites = favorites.filter(flight => flight.flightNumber !== flightNumber);
        localStorage.setItem("favoriteFlights", JSON.stringify(updatedFavorites));
        setIsFavorited(false);
      } else {
        const updatedFavorites = [...favorites, { airline, flightNumber, from, to, departureTime, arrivalTime, date, price }];
        localStorage.setItem("favoriteFlights", JSON.stringify(updatedFavorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error updating favoriteFlights in localStorage:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.iconCircle}>
          <FaPlaneDeparture className={styles.icon} />
        </div>
        <div>
          <h5>{airline}</h5>
          <small>{flightNumber}</small>
        </div>
      </div>

      <div className={styles.route}>
        <span className={styles.city}>{from}</span>
        <span className={styles.dash}>----------------------------</span>
        <span className={styles.city}>{to}</span>
      </div>

      <div className={styles.timeBlock}>
        <div className="d-flex flex-column me-3 text-center">
          <strong>{departureTime}</strong>
          <small className="">{from}</small>
        </div>
        <FaClock className={styles.timeIcon} />
      </div>

      <div className={styles.timeBlock}>
        <div className="d-flex flex-column me-3">
          <strong>{arrivalTime}</strong>
          <small>{to}</small>
        </div>
        <FaCalendarAlt className={styles.dateIcon} />
        <span className={styles.date}>{date}</span>
      </div>

      <div className={styles.priceSection}>
        <span className={styles.price}>
          <FaDollarSign className={styles.dollarIcon} />
          <span>${price}</span>
        </span>
        <small className={styles.perPerson}>Per person</small>
      </div>

      <button className={styles.bookBtn} onClick={onBook}>
        Book Now
      </button>
      <button
        className={styles.favoriteBtn}
        onClick={handleFavoriteToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isFavorited || isHovered ? <FaHeart className={styles.favoriteIcon} /> : <FaRegHeart className={styles.favoriteIcon} />}
      </button>
    </div>
  );
}