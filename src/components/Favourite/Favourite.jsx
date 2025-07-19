import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import FavoriteFlightCard from "../FavouriteCard/FavouriteCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { setSelectedFlight } = useContext(FlightContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem("favoriteFlights") || "[]");
      setFavorites(storedFavorites);
    } catch (error) {
      console.error("Error reading favoriteFlights from localStorage:", error);
    }
  }, []);

  const removeFavorite = (flightNumber) => {
    try {
      const updatedFavorites = favorites.filter(flight => flight.flightNumber !== flightNumber);
      localStorage.setItem("favoriteFlights", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error updating favoriteFlights in localStorage:", error);
    }
  };

  const handleBook = (flight) => {
    setSelectedFlight(flight); 
    navigate("/myflights"); 
  };

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h3 className="mb-4">Favorite Flights</h3>
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