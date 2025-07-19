import React, { useEffect, useState } from 'react';
import Style from './HotelSearchh.module.css';

export default function HotelSearch() {
  const [city, setCity] = useState("");
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [priceRange, setPriceRange] = useState(500); 
  const [maxHotelPrice, setMaxHotelPrice] = useState(500);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (params = "") => {
    const res = await fetch(`http://localhost:3000/api/hotels${params}`);
    const data = await res.json();
    setHotels(data);

    // Get max price dynamically
    const max = Math.max(...data.map(h => h.price));
    setMaxHotelPrice(max);
    setPriceRange(max); //==> Set slider to max initially
    setFilteredHotels(data); //==> Initial display
  };

  const handleSearch = () => {
    const params = city ? `?city=${city}` : "";
    fetchHotels(params);
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange(value);

    // Filter based on price
    const filtered = hotels.filter(h => h.price <= value);
    setFilteredHotels(filtered);
  };

  const onSelectHotel = (hotel) => {
    alert(`You selected: ${hotel.name}`);
  };

  return (
    <>
      <div className={`${Style['hotel-search']} container d-flex align-items-end justify-content-between pt-5`}>
       <div className='w-50 pt-5'>
         <h2>🏨 Hotels</h2>
        <input placeholder="City" onChange={e => setCity(e.target.value)} />
        <button onClick={handleSearch}>Search Hotels</button>
       </div>

        <div className={Style.slider}>
          <label className='text-white'>Max Price: ${priceRange}</label>
          <input
            type="range"
            min="0"
            max={maxHotelPrice}
            value={priceRange}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div className={`${Style['hotel-list']} container`}>
        {filteredHotels.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Price/Night ($)</th>
                <th>Available Rooms</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map(h => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.city}</td>
                  <td>{h.price}</td>
                  <td>{h.availableRooms}</td>
                  <td><button onClick={() => onSelectHotel(h)}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hotels found.</p>
        )}
      </div>
    </>
  );
}
