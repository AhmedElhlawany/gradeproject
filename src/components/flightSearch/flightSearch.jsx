import React, { useContext, useEffect, useState } from 'react';
import Style from './flightSearch.module.css';
import { FlightContext } from '../Context/FlightContext';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import FlightCard from '../FlightCard/FlightCard';

export default function FlightSearch() {
  const [query, setQuery] = useState({ from: "", to: "", date: "" });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [filter, setFilter] = useState('none');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [stopFilter, setStopFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([0, 23.99]);
  const [airlineFilter, setAirlineFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
const [cities, setCities] = useState([])
  const { selectedFlight, setSelectedFlight, adults, setAdults, child, setChild } = useContext(FlightContext);

  const navigate = useNavigate();

  const togglePassengerDropdown = () => setShowPassengerDropdown(!showPassengerDropdown);
  const toggleFilterDropdown = () => setShowFilterDropdown(!showFilterDropdown);
  const toggleFilterSidebar = () => setShowFilterSidebar(!showFilterSidebar);

  const handleDone = () => {
    setShowPassengerDropdown(false);
    console.log("Selected:", { adults, children: child });
  };

  const fetchFlights = async (params = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/flights${params}`);
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();
      setFlights(data);
      setFilteredFlights(data);
      setCities(data.map(flight => flight.from));
    } catch (err) {
      setError("Failed to load flights. Please try again later.");
      setFlights([]);
      setFilteredFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.from) params.append("from", query.from);
    if (query.to) params.append("to", query.to);
    if (query.date) params.append("date", query.date);
    fetchFlights(`?${params.toString()}`);
    setIsSearched(true);
    setShowFilterSidebar(true);
    setFilter('none');
  };

  const calculateDuration = (flight) => {
    if (!flight.departureTime || !flight.arrivalTime) return Infinity;
    const departure = new Date(`2025-08-01T${flight.departureTime}:00`);
    let arrival = new Date(`2025-08-01T${flight.arrivalTime}:00`);
    if (arrival < departure) {
      arrival = new Date(arrival.getTime() + 24 * 60 * 60 * 1000);
    }
    let duration = (arrival - departure) / (1000 * 60);
    if (flight.transit) {
      const [hours, minutes] = (flight.transit.transitDuration || '0h 0m').split('h ');
      duration += parseInt(hours) * 60 + (minutes ? parseInt(minutes.replace('m', '')) : 0);
    }
    return duration;
  };

  const applySortFilter = (filterType) => {
    let sortedFlights = [...flights];
    if (filterType === 'cheapest') {
      sortedFlights.sort((a, b) => a.price * (adults + child * 0.5) - b.price * (adults + child * 0.5));
    } else if (filterType === 'fastest') {
      sortedFlights.sort((a, b) => calculateDuration(a) - calculateDuration(b));
    } else if (filterType === 'best') {
      const maxPrice = Math.max(...flights.map(f => f.price * (adults + child * 0.5))) || 1;
      const maxDuration = Math.max(...flights.map(f => calculateDuration(f))) || 1;
      sortedFlights.sort((a, b) => {
        const aScore = (0.6 * (a.price * (adults + child * 0.5) / maxPrice)) + (0.4 * (calculateDuration(a) / maxDuration));
        const bScore = (0.6 * (b.price * (adults + child * 0.5) / maxPrice)) + (0.4 * (calculateDuration(b) / maxDuration));
        return aScore - bScore;
      });
    }
    setFilter(filterType);
    applyFilters(sortedFlights);
    setShowFilterDropdown(false);
  };

  const applyFilters = (flightsToFilter = flights) => {
    let result = [...flightsToFilter];
    if (stopFilter.length > 0) {
      result = result.filter(flight => stopFilter.includes(flight.stops?.toString() || (flight.transit ? '1' : '0')));
    }
    if (timeFilter[0] !== 0 || timeFilter[1] !== 23.99) {
      result = result.filter(flight => {
        const [hour, minute] = (flight.departureTime || '0:0').split(':').map(Number);
        const decimalTime = hour + minute / 60;
        return decimalTime >= timeFilter[0] && decimalTime <= timeFilter[1];
      });
    }
    if (airlineFilter.length > 0) {
      result = result.filter(flight => airlineFilter.includes(flight.airline));
    }
    setFilteredFlights(result);
  };

  useEffect(() => {
    applyFilters(flights);
  }, [stopFilter, timeFilter, airlineFilter, flights]);

  const uniqueAirlines = React.useMemo(() => [...new Set(flights.map(flight => flight.airline))], [flights]);

  const formatTime = (value) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className={`container ${Style['flight-search']}`}>
        <h2>✈️ Flights</h2>
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 w-100">
          <div className={`${Style['form-floating']} form-floating mb-3`}>
            <input
              type="text"
              onChange={e => setQuery({ ...query, from: e.target.value })}
              className="form-control"
              id="floatingInputFrom"
              placeholder="From"
               list={cities}
            />
            <label htmlFor="floatingInputFrom">From</label>
          </div>
          <div className={`${Style['form-floating']} form-floating mb-3`}>
            <input
              type="text"
              onChange={e => setQuery({ ...query, to: e.target.value })}
              className="form-control"
              id="floatingInputTo"
              placeholder="To"
             
            />
            <label htmlFor="floatingInputTo">To</label>
          </div>
          <div className={`${Style['form-floating']} form-floating mb-3`}>
            <input
              type="date"
              onChange={e => setQuery({ ...query, date: e.target.value })}
              className="form-control"
              id="floatingInputDate"
              placeholder="Date"
            />
            <label htmlFor="floatingInputDate">Date</label>
          </div>
          <div className={`dropdown ${Style['form-floating']}`}>
            <button
              className={`btn dropdown-toggle p-3 mb-2 ${Style['dropdown-button']}`}
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
          <button
            onClick={handleSearch}
            className={`${Style['search-button']} p-3 mb-2`}
          >
            Search Flights
          </button>
        </div>

        {isSearched && (
          <>
            {isLoading && <div className="text-center py-5">Loading flights...</div>}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {!isLoading && !error && (
              <div className="d-flex text-dark">
                <div className={`bg-light border-end p-4 transition-all duration-300 text-dark ${showFilterSidebar ? 'w-25' : 'w-0 d-none'} overflow-hidden`} style={{ minWidth: showFilterSidebar ? '250px' : '0' }}>
                  <h3 className="h5 mb-3">Filters</h3>
                  <div className="mb-4">
                    <h4 className="h6 mb-2">Stops</h4>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="stop0"
                        value="0"
                        checked={stopFilter.includes('0')}
                        onChange={e => {
                          const value = e.target.value;
                          setStopFilter(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      <label className="form-check-label text-dark" htmlFor="stop0">
                        Non-stop
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="stop1"
                        value="1"
                        checked={stopFilter.includes('1')}
                        onChange={e => {
                          const value = e.target.value;
                          setStopFilter(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      <label className="form-check-label text-dark" htmlFor="stop1">
                        1 Stop
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="stop2"
                        value="2"
                        checked={stopFilter.includes('2')}
                        onChange={e => {
                          const value = e.target.value;
                          setStopFilter(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      <label className="form-check-label text-dark" htmlFor="stop2">
                        2+ Stops
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 mb-2">Departure Time</h4>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">{formatTime(timeFilter[0])}</span>
                      <input
                        type="range"
                        min="0"
                        max="23.99"
                        step="0.25"
                        value={timeFilter[0]}
                        onChange={e => setTimeFilter([Number(e.target.value), timeFilter[1]])}
                        className="form-range flex-grow-1 mx-2"
                      />
                      <span className="ms-2">{formatTime(timeFilter[1])}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="h6 mb-2">Airlines</h4>
                    {uniqueAirlines.map(airline => (
                      <div key={airline} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`airline-${airline}`}
                          value={airline}
                          checked={airlineFilter.includes(airline)}
                          onChange={e => {
                            const value = e.target.value;
                            setAirlineFilter(prev =>
                              prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                            );
                          }}
                        />
                        <label className="form-check-label text-dark" htmlFor={`airline-${airline}`}>
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-end mb-3">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={toggleFilterSidebar}
                    >
                      {showFilterSidebar ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        onClick={toggleFilterDropdown}
                      >
                        Sort: {filter === 'none' ? 'None' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                      {showFilterDropdown && (
                        <div className="dropdown-menu show">
                          <button
                            className="dropdown-item"
                            onClick={() => applySortFilter('cheapest')}
                          >
                            Cheapest
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => applySortFilter('fastest')}
                          >
                            Fastest
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => applySortFilter('best')}
                          >
                            Best
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {filteredFlights.length > 0 ? (
                    <div className={`container ${Style['flight-list']}`}>
                      {filteredFlights.map((flight, index) => (
                        <FlightCard
                          key={flight.id}
                          id={flight.id}
                          airline={flight.airline}
                          flightNumber={`Flight #${index + 1}`}
                          from={flight.from}
                          to={flight.to}
                          toAirport={flight?.toAirport?.code}
                          fromAirport={flight?.fromAirport?.code}
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
                    <div className="card text-center my-5 py-5 ms-4">
                      <div className="card-body">
                        <Plane className="text-muted mb-3" size={48} aria-hidden="true" />
                        <h5>No flights found</h5>
                        <p className="text-muted">Try adjusting your filters or search criteria.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isSearched && (
        <div
          className="container"
          style={{ textAlign: 'center', padding: '2rem', fontSize: '1.3rem', color: '#3db9ef' }}
        >
          <h1>🌍 Start your journey with us — explore, discover, and fly to your dream destination! ✈️</h1>
        </div>
      )}
    </>
  );
}