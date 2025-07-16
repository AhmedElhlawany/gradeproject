import React from "react";
import styles from "./FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign } from "react-icons/fa";

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
    </div>
  );
}
