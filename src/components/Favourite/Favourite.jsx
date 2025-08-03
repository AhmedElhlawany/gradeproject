// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { FlightContext } from "../Context/FlightContext";
// import FavoriteFlightCard from "../FavouriteCard/FavouriteCard";
// import { FavoritesContext } from "../Context/FavouriteContext";

// export default function FavoritesPage() {
//   const { favorites, toggleFavorite } = useContext(FavoritesContext);
//   const { setSelectedFlight } = useContext(FlightContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const userId = currentUser?.id;

//   useEffect(() => {
//     console.log("Favorites:", favorites);
//     if (!userId) {
//       setError("Please log in to view your favorites.");
//       setLoading(false);
//       return;
//     }
//     setLoading(false);
//   }, [userId, favorites]);

//   const removeFavorite = async (flightId) => {
//     if (!userId) {
//       setError("Please log in to manage favorites.");
//       return;
//     }

//     try {
//       const flight = favorites.find((f) => f.id === flightId && f.type === "flight");
//       if (!flight) {
//         throw new Error("Flight not found in favorites");
//       }
//       await toggleFavorite(flight);
//     } catch (err) {
//       console.error("Error removing favorite:", err);
//       setError(`Failed to remove favorite: ${err.message}`);
//     }
//   };

//   const handleBook = (flight) => {
//     console.log("Booking flight:", flight);
//     setSelectedFlight(flight);
//     navigate("/myflights");
//   };

//   const flightFavorites = favorites.filter((f) => f.type === "flight");
//   console.log("Flight Favorites:", flightFavorites);

//   if (!userId) {
//     return (
//       <h2 className="text-center mt-5" style={{ paddingTop: "100px" }}>
//         Please log in to view your favorites.
//       </h2>
//     );
//   }

//   if (loading) {
//     return <div className="container mt-5">Loading favorite flights...</div>;
//   }

//   if (error) {
//     return <div className="container mt-5 text-danger">{error}</div>;
//   }

//   return (
//     <div className="container my-5" style={{ paddingTop: "70px" }}>
//       <h3 className="mb-4 pt-5">Favorite Flights</h3>
//       {flightFavorites.length === 0 ? (
//         <p className="text-center">No favorite flights added yet, or flight data is incomplete.</p>
//       ) : (
//         <div className="row">
//           {flightFavorites.map((flight) => (
//             <div key={flight.id} className="col-12 col-sm-12 col-md-12 col-lg-4 mb-4">
//               <FavoriteFlightCard
//                 flight={flight}
//                 onRemove={() => removeFavorite(flight.id)}
//                 onBook={() => handleBook(flight)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import { FavoritesContext } from "../Context/FavouriteContext";
import FavoriteCard from "../FavouriteCard/FavouriteCard";
import FavoriteHotelCard from "../FavoriteHotelCard/FavoriteHotelCard";
import "./favorite.css";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { setSelectedFlight, setHotel } = useContext(FlightContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;

  useEffect(() => {
    console.log("Favorites:", favorites);
    if (!userId) {
      setError("Please log in to view your favorites.");
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [userId, favorites]);

  const removeFavorite = async (itemId, type) => {
    if (!userId) {
      setError("Please log in to manage favorites.");
      return;
    }

    try {
      const item = favorites.find((f) => f.id === itemId && f.type === type);
      if (!item) {
        throw new Error(`${type} not found in favorites`);
      }
      await toggleFavorite(item);
    } catch (err) {
      console.error(`Error removing ${type} favorite:`, err);
      setError(`Failed to remove favorite: ${err.message}`);
    }
  };

  const handleBookFlight = (flight) => {
    console.log("Booking flight:", flight);
    setSelectedFlight(flight);
    navigate("/myflights");
  };

  const handleBookHotel = (hotel) => {
    console.log("Booking hotel:", hotel);
    setHotel(hotel);
    navigate(`/hotelDetails/${hotel.id}`);
  };

  const flightFavorites = favorites.filter((f) => f.type === "flight");
  const hotelFavorites = favorites.filter((f) => f.type === "hotel");

  if (!userId) {
    return (
      <h2 className="text-center mt-5" style={{ paddingTop: "100px" }}>
        Please log in to view your favorites.
      </h2>
    );
  }

  if (loading) {
    return <div className="container mt-5">Loading favorites...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h3 className="mb-4 pt-5">Favorites</h3>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "flights" ? "active" : ""}`}
            onClick={() => setActiveTab("flights")}
          >
            Flights
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => setActiveTab("hotels")}
          >
            Hotels
          </button>
        </li>
      </ul>

      {activeTab === "flights" && (
        <div>
          <h4 className="mb-3">Favorite Flights</h4>
          {flightFavorites.length === 0 ? (
            <p className="text-center">No favorite flights added yet.</p>
          ) : (
            <div className="row">
              {flightFavorites.map((flight) => (
                <div key={flight.id} className="col-12 col-sm-12 col-md-12 col-lg-4 mb-4">
                  <FavoriteCard
                    flight={flight}
                    onRemove={() => removeFavorite(flight.id, "flight")}
                    onBook={() => handleBookFlight(flight)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "hotels" && (
        <div>
          <h4 className="mb-3">Favorite Hotels</h4>
          {hotelFavorites.length === 0 ? (
            <p className="text-center">No favorite hotels added yet.</p>
          ) : (
            <div className="row">
              {hotelFavorites.map((hotel) => (
                <div key={hotel.id} className="col-12 col-sm-12 col-md-12 col-lg-4 mb-4">
                  <FavoriteHotelCard
                    hotel={hotel}
                    onRemove={() => removeFavorite(hotel.id, "hotel")}
                    onBook={() => handleBookHotel(hotel)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}