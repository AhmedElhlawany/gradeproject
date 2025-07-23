import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import FavoriteFlightCard from "../FavouriteCard/FavouriteCard";
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { setSelectedFlight } = useContext(FlightContext);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser?.email) {
      try {
        const storedFavorites = JSON.parse(
          localStorage.getItem(`favoriteFlights_${currentUser.email}`) || "[]"
        );
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error reading favorites from localStorage:", error);
      }
    }
  }, [currentUser?.email]);

  const removeFavorite = (flightNumber) => {
    try {
      const updatedFavorites = favorites.filter(flight => flight.flightNumber !== flightNumber);
      localStorage.setItem(
        `favoriteFlights_${currentUser.email}`,
        JSON.stringify(updatedFavorites)
      );
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorites in localStorage:", error);
    }
  };

  const handleBook = (flight) => {
    setSelectedFlight(flight);
    navigate("/myflights");
  };

  if (!currentUser) {
    return <h2 className="text-center mt-5" style={{ paddingTop: "100px" } }> Please log in to view your favorites.</h2>;
  }

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h3 className="mb-4 pt-5">Favorite Flights</h3>
      {favorites.length === 0 ? (
        <p className="text-center">No favorite flights added yet.</p>
      ) : (
        <div className="row">
          {favorites.map((flight) => (
            <div key={flight.flightNumber} className="col-12 col-sm-12 col-md-12 col-lg-4 mb-4">
              <FavoriteFlightCard
                flight={flight}
                onRemove={removeFavorite}
                onBook={() => handleBook(flight)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
