import React, { useState } from "react";
import styles from "./FavoriteFlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaHeart, FaRegHeart } from "react-icons/fa";

export default function FavoriteFlightCard({ flight, onRemove, onBook }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`${styles.card} d-flex flex-column p-2`}>
      <div className="d-flex flex-row flex-wrap align-items-center mb-2">
        <div className="d-flex align-items-center me-2">
          <div className={styles.iconCircle}>
            <FaPlaneDeparture className={styles.icon} />
          </div>
          <div className="ms-2">
            <h5 className="mb-0">{flight.airline}</h5>
            <small>{flight.flightNumber}</small>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center flex-grow-1 justify-content-between">
          <div className={`${styles.timeBlock} d-flex align-items-center me-2`}>
            <FaClock className={styles.timeIcon} />
            <div className="ms-1">
              <strong>{flight.departureTime}</strong>
              <small className="d-block">{flight.from}</small>
            </div>
          </div>
          <div className={`${styles.route} d-flex align-items-center mx-2`}>
            <span className={styles.city}>{flight.from}</span>
            <span className={styles.dash}>—</span>
            <span className={styles.city}>{flight.to}</span>
          </div>
          <div className={`${styles.timeBlock} d-flex align-items-center me-2`}>
            <FaCalendarAlt className={styles.dateIcon} />
            <div className="ms-1">
              <strong>{flight.arrivalTime}</strong>
              <small className="d-block">{flight.to}</small>
              <span className={styles.date}>{flight.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className={styles.priceSection}>
          <span className={styles.price}>
            <FaDollarSign className={styles.dollarIcon} />
            <span>${flight.price}</span>
          </span>
          <small className={styles.perPerson}>Per person</small>
        </div>
        <button
          className={styles.favoriteBtn}
          onClick={() => onRemove(flight.flightNumber)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? <FaRegHeart className={styles.favoriteIcon} /> : <FaHeart className={styles.favoriteIcon} />}
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <button className={styles.bookBtn} onClick={onBook}>
          Book Now
        </button>
      </div>
    </div>
  );
}