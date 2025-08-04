import React, { useState, useEffect, useContext } from "react";
import styles from "./FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaRegHeart, FaHeart } from "react-icons/fa";
import { FavoritesContext } from "../Context/FavouriteContext";
import Swal from 'sweetalert2';

export default function FlightCard({
  id,
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
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId || !id) {
      setIsFavorited(false);
      setIsLoading(false);
      return;
    }

    setIsFavorited(favorites.some(f => f.id === id && f.type === "flight"));
    setIsLoading(false);
  }, [id, userId, favorites]);

  const handleFavoriteToggle = async () => {
    if (!userId) {
      await Swal.fire({
        title: 'Error!',
        text: 'Please login to use favorites',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!id) {
      await Swal.fire({
        title: 'Error!',
        text: 'Invalid flight data. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const flightData = {
        id,
        type: "flight",
        airline,
        flightNumber,
        from,
        to,
        departureTime,
        arrivalTime,
        date,
        price,
      };

      await toggleFavorite(flightData);
      setIsFavorited(!isFavorited);
      await Swal.fire({
        title: 'Success!',
        text: isFavorited ? 'Flight removed from favorites' : 'Flight added to favorites',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
                  confirmButton: `btn ${styles['conbtn']}`,
                }
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      await Swal.fire({
        title: 'Error!',
        text: `Failed to update favorite: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      
      });
    }
  };

  return (
    <div className={styles.card}>
      <div
        onClick={() => onBook && onBook()}
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
            <span>${price}</span>
          </span>
          <small className={styles.perPerson}>per person</small>
        </div>
      </div>

      <button
        className={styles.favoritefBtn}
        onClick={handleFavoriteToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Loading...</span>
        ) : isFavorited || isHovered ? (
          <FaHeart className={styles.favoriteIcon} />
        ) : (
          <FaRegHeart className={styles.favoriteIcon} />
        )}
      </button>
    </div>
  );
}