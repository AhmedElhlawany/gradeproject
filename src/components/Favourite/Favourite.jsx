import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";
import FavoriteFlightCard from "../FavouriteCard/FavouriteCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedFlight } = useContext(FlightContext);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser?.email;

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((favorites) => {
        // تصفية الرحلات فقط
        const flightsOnly = favorites.filter((f) => f.type === "flight");
        setFavorites(flightsOnly);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorite flights. Please try again.");
        setLoading(false);
      });
  }, [userEmail]);

  const removeFavorite = async (flightId) => {
    if (!userEmail) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(userEmail)}/favorites`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: flightId, type: "flight" }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove favorite");
      }

      // تحديث الـ state
      setFavorites((prev) => prev.filter((f) => f.id !== flightId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(`Failed to remove favorite: ${err.message}`);
    }
  };

  const handleBook = (flight) => {
    setSelectedFlight(flight);
    navigate("/myflights");
  };

  if (!userEmail) {
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
      {favorites.length === 0 ? (
        <p className="text-center">No favorite flights added yet.</p>
      ) : (
        <div className="row">
          {favorites.map((flight) => (
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