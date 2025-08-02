import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = parseInt(currentUser?.id);

  useEffect(() => {

    if (!userId || !localStorage.getItem('token')) {
      console.error('No userId or token found');
      setFavorites([]);
      return;
    }


    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        console.log('Fetching favorites for user:', userId);
        const res = await fetch(`http://localhost:3000/api/users/${userId}/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Response status:', res.status);
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
          setFavorites([]);
          return;
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch favorites');
        }
        const data = await res.json();
        console.log('Favorites data:', data);
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error.message, error.stack);
        setFavorites([]);
        alert(`Failed to load favorites: ${error.message}`);
      }
    };

const handleStorageChange = () => {
    const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
    const updatedUserId = parseInt(updatedUser?.id);

    if (!updatedUserId || !localStorage.getItem('token')) {
      setFavorites([]);
      return;
    }

    fetchFavorites(updatedUserId);
  };
 window.addEventListener('storage', handleStorageChange);
  handleStorageChange(); // initial run

  return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  const toggleFavorite = async (flight) => {
    if (!userId || !localStorage.getItem('token')) {
      alert('You must be logged in to favorite flights.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:3000/api/users/${userId}/favorites`;
      const isFavorited = favorites.some(f => f.id === flight.id && f.type === 'flight');

      let payload;
      if (!isFavorited) {
        const resFlight = await fetch(`http://localhost:3000/api/flights/${flight.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!resFlight.ok) {
          throw new Error('Failed to fetch flight details');
        }
        const flightDetails = await resFlight.json();
        payload = {
          favoriteId: flight.id,
          type: 'flight',
          airline: flightDetails.airline || 'Unknown Airline',
          flightNumber: flightDetails.flightNumber || 'N/A',
          from: flightDetails.from || 'Unknown',
          to: flightDetails.to || 'Unknown',
          departureTime: flightDetails.departureTime || 'N/A',
          arrivalTime: flightDetails.arrivalTime || 'N/A',
          date: flightDetails.date || 'N/A',
          price: flightDetails.price || 'N/A',
        };
      } else {
        payload = {
          favoriteId: flight.id,
          type: 'flight',
        };
      }

      const method = isFavorited ? 'DELETE' : 'POST';
      console.log(`Toggling favorite: ${method}`, payload);
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        setFavorites([]);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update favorite');
      }

      const data = await res.json();
      setFavorites(data.favorites);
      console.log('Updated favorites:', data.favorites);
    } catch (error) {
      console.error('Error toggling favorite:', error.message, error.stack);
      alert(`Failed to update favorite: ${error.message}`);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};