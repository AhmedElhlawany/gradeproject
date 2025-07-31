import React from "react";
import styles from "../FlightCard/FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaTrash } from "react-icons/fa";

export default function FavoriteFlightCard({ flight, onRemove, onBook }) {
  if (!flight || !flight.id || !flight.type) {
    return <div className={styles.card}>Invalid flight data</div>;
  }

  const {
    id,
    airline = "Unknown Airline",
    flightNumber = "N/A",
    from = "Unknown",
    to = "Unknown",
    departureTime = "N/A",
    arrivalTime = "N/A",
    date = "N/A",
    price = "N/A",
  } = flight;

  return (
    <div className={styles.card}>
      <div
        onClick={onBook}
        className={`d-flex justify-content-between flex-wrap w-100 ${styles.flightCard}`}
      >
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
            <small>{from}</small>
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
            <span>{typeof price === 'number' ? `$${price}` : price}</span>
          </span>
          <small className={styles.perPerson}>per person</small>
        </div>
      </div>

      <button
        className={styles.favoriteBtn}
        onClick={onRemove}
        title="Remove from Favorites"
      >
        <FaTrash className={styles.favoriteIcon} />
      </button>
    </div>
  );
}