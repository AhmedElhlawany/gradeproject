import React, { useContext, useEffect, useState } from 'react';
import Style from './FlightSearch.module.css';
import { FlightContext } from '../Context/FlightContext';
import { useNavigate } from 'react-router-dom';
import FlightCard from '../FlightCard/FlightCard';

export default function FlightSearch() {
  const [query, setQuery] = useState({ from: "", to: "", date: "" });
  const [flights, setFlights] = useState([]);
  const [isSearched, setIsSearched] = useState(false); 

  const { selectedFlight, setSelectedFlight , adults, setAdults, child, setChild } = useContext(FlightContext);
 
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleDone = () => {
    setShowDropdown(false);
    console.log("Selected:", { adults, children });
  };
  const navigate = useNavigate();

  const fetchFlights = async (params = "") => {
    const res = await fetch(`http://localhost:3000/api/flights${params}`);
    const data = await res.json();
    setFlights(data);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.from) params.append("from", query.from);
    if (query.to) params.append("to", query.to);
    if (query.date) params.append("date", query.date);

    fetchFlights(`?${params.toString()}`);
    setIsSearched(true); 
  };

  return (
    <>
      <div className={`container ${Style['flight-search']}`}>
        <h2>✈️ Flights</h2>
        <div className='d-flex justify-content-between align-items-center flex-wrap mb-4 w-100'>
        <div className={`${Style['form-floating']} form-floating mb-3`}>
  <input type="text" onChange={e => setQuery({ ...query, from: e.target.value })} className="form-control" id="floatingInput" placeholder="name@example.com"/>
  <label htmlFor="floatingInput">From</label>
</div>
        {/* <input placeholder="From"  /> */}
        <div className={`${Style['form-floating']} form-floating mb-3`}>
  <input type="text" onChange={e => setQuery({ ...query, to: e.target.value })} className="form-control" id="floatingInput" placeholder="name@example.com"/>
  <label htmlFor="floatingInput">To</label>
</div>
{/*  */}
        <div className={`${Style['form-floating']} form-floating mb-3`}>
  <input type="date" onChange={e => setQuery({ ...query, date: e.target.value })} className="form-control" id="floatingInput" placeholder="name@example.com"/>
  <label htmlFor="floatingInput">Date</label>
</div>
 <div className="dropdown">
      <button
        className="btn btn-outline-primary dropdown-toggle p-3 mb-2 "
        onClick={toggleDropdown}
        type="button"
      >
        {adults} Adults, {child} Children
      </button>

      {showDropdown && (
        <div
          className="dropdown-menu p-5 show"
          style={{ minWidth: "220px" }}
        >
          <div className="mb-2  d-flex justify-content-between align-items-center">
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

        {/* <input type="date"  /> */}
        <button onClick={handleSearch} className={`${Style['search-button']} p-3 mb-2`}>Search Flights</button>
        </div>
      </div>

      {!isSearched ? (
        <div className="container" style={{ textAlign: 'center', padding: '2rem', fontSize: '1.3rem', color: '#3db9ef' }}>
          <h1>🌍 Start your journey with us — explore, discover, and fly to your dream destination! ✈️</h1>
        </div>
      ) : flights.length > 0 ? (
        <div className={`container ${Style['flight-list']}`}>
          {flights.map((flight, index) => (
            <FlightCard
              key={flight.id}
              id={flight.id}
              airline={flight.airline}
              flightNumber={`Flight #${index + 1}`}
              from={flight.from}
              to={flight.to}
              date={flight.date}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              price={flight.price * (adults + child * 0.5)} 
              onBook={() => {
                setSelectedFlight(flight);
                navigate("/myflights");
              }}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No flights found.</p>
      )}
    </>
  );
}
