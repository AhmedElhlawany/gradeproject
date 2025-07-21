import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Style from './MyFlights.module.css';
import { FlightContext } from '../Context/FlightContext';
import Places from '../places/places';
import WeatherCard from '../Weather/Weather';

export default function MyFlights() {
  const { selectedFlight, numberOfPersons } = useContext(FlightContext);

  const navigate = useNavigate();

  const handlePayment = () => {
    navigate("/payment");
  };

  if (!selectedFlight) {
    return (
      <div className="container text-center mt-5" style={{ paddingTop: "70px" }}>
        <h3>No flight selected</h3>
        <p>Please go back and select a flight first.</p>
      </div>
    );
  }

  return (
    <div className={`container ${Style['my-flights']}`} >
      <h2 className={Style['flight-title']}>🛫 Your Selected Flight</h2>

      <div className={`${Style['flight-card']} my-4`}>
        <p><strong>From:</strong> {selectedFlight.from}</p>
        <p><strong>To:</strong> {selectedFlight.to}</p>
        <p><strong>Date:</strong> {selectedFlight.date}</p>
        <p><strong>Departure Time:</strong> {selectedFlight.departureTime}</p>
        <p><strong>Arrival Time:</strong> {selectedFlight.arrivalTime}</p>
        <p><strong>Airline:</strong> {selectedFlight.airline}</p>
       <p><strong>Number of Persons:</strong> {numberOfPersons}</p>
       <p><strong>Total Price:</strong> ${selectedFlight.price * numberOfPersons}</p>


        {selectedFlight.transit && (
          <div className={Style['transit-box']}>
            <h5>🛬 Transit Info</h5>
            <p><strong>Transit City:</strong> {selectedFlight.transit.transitCity}</p>
            <p><strong>Transit Duration:</strong> {selectedFlight.transit.transitDuration}</p>
          </div>
        )}

        <div className="d-flex justify-content-center mt-4">
          <button className={Style.paymentBtn} onClick={handlePayment}>
            Proceed to Payment
          </button>
        </div>
      </div>

      <h3 className={Style['section-title']}>🌤️ Weather Forecast</h3>
      <WeatherCard city={selectedFlight.to} date={selectedFlight.date} />

      <h3 className={Style['section-title']}> Places You Can Visit in {selectedFlight.to}</h3>
      <Places city={selectedFlight.to} />
    </div>
  );
}