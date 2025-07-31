import React, { useContext, useEffect, useState } from 'react'
import Style from './HotelDetails.module.css'
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../Context/FlightContext';
export default function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hotelId = window.location.pathname.split('/').pop();
  const {bookedHotel , setBookedHotel} = useContext(FlightContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}`);
        const data = await response.json();
        setHotel(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [hotelId]);
 const handleImageError = () => setImageError(true);

  const renderStars = rating => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#ffc107' : '#dee2e6' }}>
        ★
      </span>
    ));
  };

  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading hotel details...</p>
      </div>
    );

  if (error)
    return (
      <div className="container text-center py-5">
        <h3>Error Loading Hotel</h3>
        <p>{error}</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );

  if (!hotel) return null;

  return (
    <div className="container py-5 mt-5">
      <button className="btn  mb-4" onClick={() => navigate(-1)}>
        ← Back to Hotels
      </button>

      <div className="card mb-5 shadow">
        <div className="row g-0">
          <div className="col-md-6">
           
              <img
                src={`/${hotel.image}`}
                alt={hotel.name}
                className="w-100 rounded-start h-100 "
              />

          </div>

          <div className="col-md-6">
            <div className={`${Style['card-body']} px-5 py-2`}>
              <h2 className="card-title mb-2">{hotel.name}</h2>

              <div className="mb-3 d-flex align-items-center">
                <div className="me-2">{renderStars(hotel.rate)}</div>
                <strong>{hotel.rate}</strong>
              </div>

              <p className="card-text">{hotel.description}</p>

              {/* <h4 className="text-warning mt-4">${hotel.availableRooms[0].price} <small className="text-muted fs-6">/ night</small></h4> */}

              <p className="mt-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                <strong>Location:</strong> {hotel.city}
              </p>
              <div className='d-flex'>
 <strong className='me-4'>Available Rooms: </strong>
 <ul>
   {hotel.availableRooms.map((room, index) => (
     <li key={index}><strong>{room.type}:</strong>  {room.price} $ /night</li>
   ))}
 </ul>
              </div>
              
              

              <button className={`${Style['bookHotel-button']} my-4`} onClick={() => {navigate(`/hotellpayment`, { state: { hotel } }) ,setBookedHotel(hotel)}}>Book Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="mb-3">Hotel Amenities</h3>
        <div className="d-flex flex-wrap gap-2">
          {hotel.amenities.map((amenity, index) => (
            <span key={index} className="badge bg-secondary fs-6 p-2 px-3">
              {amenity}
            </span>
          ))}
        </div>
      </div>
<div className="row">
<div className="col-md-6 mb-3 rounded-3 overflow-hidden">
  <iframe className='rounded-3' src={hotel.location} width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
 <div className="col-md-6 p-5">
        <h3 className="mb-3">Contact Information</h3>
        <div className="row">
          <div className="col-md-12 mb-3">
            <div className="d-flex align-items-center">
              <i className={`fas fa-phone me-3 fs-3 ${Style['HDicon']}`}></i>
              <div>
                <h5 className="mb-1">Phone</h5>
                <p className="text-muted mb-0">{hotel.contact.phone}</p>
              </div>
            </div>
          </div>

          <div className="col-md-12  mb-3">
            <div className="d-flex align-items-center">
              <i className={`fas fa-envelope me-3 fs-3 ${Style['HDicon']}`}></i>
              <div>
                <h5 className="mb-1">Email</h5>
                <p className="text-muted mb-0">{hotel.contact.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
</div>



     
    </div>
  );
}