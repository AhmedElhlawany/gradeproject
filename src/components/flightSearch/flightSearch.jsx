import React, { useContext, useEffect, useState } from 'react';
import Style from './FlightSearch.module.css';
import { FlightContext } from '../Context/FlightContext';
import Places from '../places/places';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import FlightCard from '../FlightCard/FlightCard';

export default function FlightSearch() {
  const [query, setQuery] = useState({ from: "", to: "", date: "" });
  const [flights, setFlights] = useState([]);
  const [isSearched, setIsSearched] = useState(false); // ✅ تتبع هل تم البحث

  const { selectedFlight, setSelectedFlight } = useContext(FlightContext);
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
    setIsSearched(true); // ✅ عدل الحالة لما يضغط سيرش
  };

  return (
    <>
      <div className={`container ${Style['flight-search']}`}>
        <h2>✈️ Flights</h2>
        <input placeholder="From" onChange={e => setQuery({ ...query, from: e.target.value })} />
        <input placeholder="To" onChange={e => setQuery({ ...query, to: e.target.value })} />
        <input type="date" onChange={e => setQuery({ ...query, date: e.target.value })} />
        <button onClick={handleSearch} className={`${Style['search-button']}`}>Search Flights</button>
      </div>

      {!isSearched ? (
        <div className="container" style={{ textAlign: 'center', padding: '2rem', fontSize: '1.3rem', color: '#3db9ef' }}>
          <h1>🌍 Start your journey with us — explore, discover, and fly to your dream destination! ✈️</h1>
        </div>
      ) : flights.length > 0 ? (
        <div className={`container ${Style['flight-list']}`}>
          {flights.map(flight => (
            <FlightCard
              key={flight.id}
              airline={flight.airline}
              flightNumber={`Flight #${flight.id}`}
              from={flight.from}
              to={flight.to}
              date={flight.date}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              price={flight.price}
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
