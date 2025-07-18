import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem("favoriteFlights") || "[]");
      setFavorites(storedFavorites);
    } catch (error) {
      console.error("Error reading favoriteFlights from localStorage:", error);
    }
  }, []);

  const toggleFavorite = (flight) => {
    try {
      const currentFavorites = JSON.parse(localStorage.getItem("favoriteFlights") || "[]");
      const isFavorited = currentFavorites.some(f => f.flightNumber === flight.flightNumber);

      if (isFavorited) {
        const updatedFavorites = currentFavorites.filter(f => f.flightNumber !== flight.flightNumber);
        localStorage.setItem("favoriteFlights", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      } else {
        const updatedFavorites = [...currentFavorites, flight];
        localStorage.setItem("favoriteFlights", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error("Error updating favoriteFlights in localStorage:", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};