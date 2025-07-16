import React, { useContext } from 'react';
import Style from './MyFlights.module.css';
import { FlightContext } from '../Context/FlightContext';
import Places from '../places/places';
import WeatherCard from '../Weather/Weather';

export default function MyFlights() {
  const { selectedFlight } = useContext(FlightContext);

  if (!selectedFlight) {
    return (
      <div className="container text-center mt-5">
        <h3>No flight selected</h3>
        <p>Please go back and select a flight first.</p>
      </div>
    );
  }

  return (
    <div className={`container ${Style['my-flights']}`}>
      <h2 className={Style['flight-title']}>🛫 Your Selected Flight</h2>

      <div className={`${Style['flight-card']} my-4`}>
        <p><strong>From:</strong> {selectedFlight.from}</p>
        <p><strong>To:</strong> {selectedFlight.to}</p>
        <p><strong>Date:</strong> {selectedFlight.date}</p>
        <p><strong>Departure Time:</strong> {selectedFlight.departureTime}</p>
        <p><strong>Arrival Time:</strong> {selectedFlight.arrivalTime}</p>
        <p><strong>Airline:</strong> {selectedFlight.airline}</p>
        <p><strong>Price:</strong> ${selectedFlight.price}</p>

        {selectedFlight.transit && (
          <div className={Style['transit-box']}>
            <h5>🛬 Transit Info</h5>
            <p><strong>Transit City:</strong> {selectedFlight.transit.transitCity}</p>
            <p><strong>Transit Duration:</strong> {selectedFlight.transit.transitDuration}</p>
          </div>
        )}
      </div>

      <h3 className={Style['section-title']}>🌤️ Weather Forecast</h3>
      <WeatherCard city={selectedFlight.to} date={selectedFlight.date} />

      <h3 className={Style['section-title']}> Places You Can Visit in {selectedFlight.to}</h3>
      <Places city={selectedFlight.to} />
    </div>
  );
}
