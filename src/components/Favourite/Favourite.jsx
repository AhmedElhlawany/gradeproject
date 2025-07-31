import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import FavoriteFlightCard from "../FavouriteCard/FavouriteCard";
import { FavoritesContext } from "../Context/FavouriteContext";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { setSelectedFlight } = useContext(FlightContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const removeFavorite = async (flightId) => {
    if (!userId) {
      setError("Please log in to manage favorites.");
      return;
    }

    try {
      const flight = favorites.find((f) => f.id === flightId && f.type === "flight");
      if (!flight) {
        throw new Error("Flight not found in favorites");
      }
      await toggleFavorite(flight);
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(`Failed to remove favorite: ${err.message}`);
    }
  };

  const handleBook = (flight) => {
    console.log("Booking flight:", flight);
    setSelectedFlight(flight);
    navigate("/myflights");
  };

  const flightFavorites = favorites.filter((f) => f.type === "flight");
  console.log("Flight Favorites:", flightFavorites);

  if (!userId) {
    return (
      <h2 className="text-center mt-5" style={{ paddingTop: "100px" }}>
        Please log in to view your favorites.
      </h2>
    );
  }

  if (loading) {
    return <div className="container mt-5">Loading favorite flights...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container my-5" style={{ paddingTop: "70px" }}>
      <h3 className="mb-4 pt-5">Favorite Flights</h3>
      {flightFavorites.length === 0 ? (
        <p className="text-center">No favorite flights added yet, or flight data is incomplete.</p>
      ) : (
        <div className="row">
          {flightFavorites.map((flight) => (
            <div key={flight.id} className="col-12 col-sm-12 col-md-12 col-lg-4 mb-4">
              <FavoriteFlightCard
                flight={flight}
                onRemove={() => removeFavorite(flight.id)}
                onBook={() => handleBook(flight)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}