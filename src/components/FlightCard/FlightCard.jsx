import React, { useState, useEffect, useContext } from "react";
import styles from "./FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaRegHeart, FaHeart } from "react-icons/fa";
import { FlightContext } from "../Context/FlightContext";

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
const { setNumberOfPersons, setSelectedFlight } = useContext(FlightContext);
  const [isHovered, setIsHovered] = useState(false);
  const [personCount, setPersonCount] = useState(1); 

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

      <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" className={styles.bookBtn} >
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
      
<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">New message</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="noPersons" className="col-form-label">Number of persons:</label>
            <input type="number" min="1"  className="form-control" id="noPersons"  onChange={(e) => setPersonCount(Number(e.target.value))}/>
          </div>
         
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" 
        onClick={() => {
    setNumberOfPersons(personCount); 
    onBook(); 
  }}  
  data-bs-dismiss="modal" className={styles.bookBtn}>Submit</button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}