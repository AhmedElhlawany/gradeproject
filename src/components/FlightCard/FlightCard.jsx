// import React, { useState, useEffect, useContext } from "react";
// import styles from "./FlightCard.module.css";
// import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaRegHeart, FaHeart } from "react-icons/fa";
// import { FlightContext } from "../Context/FlightContext";

// export default function FlightCard({
//   id,
//   airline = "Emirates",
//   flightNumber = "Flight #1",
//   from = "Cairo",
//   to = "Dubai",
//   departureTime = "09:00",
//   arrivalTime = "13:30",
//   date = "2025-07-20",
//   price = 350,
//   onBook,
// }) {
//   const { setSelectedFlight } = useContext(FlightContext);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isFavorited, setIsFavorited] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const userEmail = currentUser?.email;

//   useEffect(() => {
//     if (!userEmail || !id) {
//       setIsFavorited(false);
//       setIsLoading(false);
//       return;
//     }

//     fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`)
//       .then(res => {
//         if (!res.ok) throw new Error("Failed to fetch favorites");
//         return res.json();
//       })
//       .then(favorites => {
//         const isFav = favorites.some(f => f.id === id && f.type === "flight");
//         setIsFavorited(isFav);
//         setIsLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching favorites:", err);
//         setIsLoading(false);
//         alert("Failed to load favorite status");
//       });
//   }, [id, userEmail]);

//   const handleFavoriteToggle = async () => {
//     if (!userEmail) {
//       alert("Please login to use favorites");
//       return;
//     }

//     if (!id) {
//       alert("Invalid flight data. Please try again.");
//       return;
//     }

//     try {
//       const endpoint = `http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`;
//       const method = isFavorited ? "DELETE" : "POST";
//       const favoriteData = {
//         id,
//         type: "flight",
//         airline,
//         flightNumber,
//         from,
//         to,
//         departureTime,
//         arrivalTime,
//         date,
//         price,
//       };

//       console.log("Sending favoriteData:", favoriteData); // للتصحيح

//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(favoriteData),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to update favorite");
//       }

//       setIsFavorited(!isFavorited);
//     } catch (error) {
//       console.error("Error toggling favorite:", error);
//       alert(`Failed to update favorite: ${error.message}`);
//     }
//   };

//   return (
//     <div className={styles.card}>
//       <div
//         onClick={() => onBook && onBook()}
//         className={`d-flex justify-content-between flex-wrap w-100 ${styles.flightCard}`}
//       >
//         <div className={styles.left}>
//           <div className={styles.iconCircle}>
//             <FaPlaneDeparture className={styles.icon} />
//           </div>
//           <div>
//             <h5>{airline}</h5>
//             <small>{flightNumber}</small>
//           </div>
//         </div>

//         <div className={styles.route}>
//           <span className={styles.city}>{from}</span>
//           <span className={styles.dash}>----------------------------</span>
//           <span className={styles.city}>{to}</span>
//         </div>

//         <div className={styles.timeBlock}>
//           <div className="d-flex flex-column me-3 text-center">
//             <strong>{departureTime}</strong>
//             <small>{from}</small>
//           </div>
//           <FaClock className={styles.timeIcon} />
//         </div>

//         <div className={styles.timeBlock}>
//           <div className="d-flex flex-column me-3">
//             <strong>{arrivalTime}</strong>
//             <small>{to}</small>
//           </div>
//           <FaCalendarAlt className={styles.dateIcon} />
//           <span className={styles.date}>{date}</span>
//         </div>

//         <div className={styles.priceSection}>
//           <span className={styles.price}>
//             <FaDollarSign className={styles.dollarIcon} />
//             <span>${price}</span>
//           </span>
//           <small className={styles.perPerson}>per person</small>
//         </div>
//       </div>

//       <button
//         className={styles.favoriteBtn}
//         onClick={handleFavoriteToggle}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <span>Loading...</span>
//         ) : isFavorited || isHovered ? (
//           <FaHeart className={styles.favoriteIcon} />
//         ) : (
//           <FaRegHeart className={styles.favoriteIcon} />
//         )}
//       </button>
//     </div>
//   );
// }


import React, { useState, useEffect, useContext } from "react";
import styles from "./FlightCard.module.css";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaDollarSign, FaRegHeart, FaHeart } from "react-icons/fa";
import { FavoritesContext } from "../Context/FavouriteContext";

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
      alert("Please login to use favorites");
      return;
    }

    if (!id) {
      alert("Invalid flight data. Please try again.");
      return;
    }

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
        className={styles.favoriteBtn}
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