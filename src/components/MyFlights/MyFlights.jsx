import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Style from './MyFlights.module.css';
import { FlightContext } from '../Context/FlightContext';
import Places from '../places/places';
import WeatherCard from '../Weather/Weather';

export default function MyFlights() {
  const { selectedFlight, adults, child , setAdults, setChild} = useContext(FlightContext);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  const togglePassengerDropdown = () => setShowPassengerDropdown(!showPassengerDropdown);
  const navigate = useNavigate();
 const handleDone = () => {
    setShowPassengerDropdown(false);
    console.log("Selected:", { adults, children: child });
  };
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
      <h2 className={Style['flight-title'] }>🛫 Your Selected Flight</h2>

      <div className={`${Style['flight-card']}  my-4`}>
      <div className="d-flex justify-content-between">
         <div>
         <p><strong>From:</strong> {selectedFlight.from}</p>
        <p><strong>To:</strong> {selectedFlight.to}</p>
        <p><strong>Date:</strong> {selectedFlight.date}</p>
        <p><strong>Departure Time:</strong> {selectedFlight.departureTime}</p>
        <p><strong>Arrival Time:</strong> {selectedFlight.arrivalTime}</p>
        <p><strong>Airline:</strong> {selectedFlight.airline}</p>
       <p><strong>Total Price:</strong> ${selectedFlight.price * (adults + child*0.5)}</p>
       </div>
 
<div className={`dropdown ${Style['form-floating']}`}>
            <button
              className={`btn dropdown-toggle mb-2 ${Style['dropdown-button']}`}
              onClick={togglePassengerDropdown}
              type="button"
            >
              {adults} Adults, {child} Children
            </button>
            {showPassengerDropdown && (
              <div className="dropdown-menu p-5 show" style={{ minWidth: "220px" }}>
                <div className="mb-2 d-flex justify-content-between align-items-center">
                  <label htmlFor="adults">Adults:</label>
                  <input
                    type="number"
                    id="adults"
                    className="form-control"
                    style={{ width: "70px" }}
                    value={adults}
                    min={1}
                    onChange={(e) => setAdults(Number(e.target.value))}
                  />
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <label htmlFor="children">Children:</label>
                  <input
                    type="number"
                    id="children"
                    className="form-control"
                    style={{ width: "70px" }}
                    value={child}
                    min={0}
                    onChange={(e) => setChild(Number(e.target.value))}
                  />
                </div>
                <button className="btn btn-primary w-100" onClick={handleDone}>
                  Done
                </button>
              </div>
            )}
          </div>
      </div>
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