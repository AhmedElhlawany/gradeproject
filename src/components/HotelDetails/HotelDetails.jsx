import React, { useContext, useEffect, useState } from 'react';
import Style from './HotelDetails.module.css';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../Context/FlightContext';
import Swal from 'sweetalert2';
import Slider from 'react-slick';
import StepsBar from '../../UI/StepsBar/StepsBar';

export default function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const hotelId = window.location.pathname.split('/').pop();
  const { bookedHotel, setBookedHotel } = useContext(FlightContext);
  const navigate = useNavigate();

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: true
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/hotels/${hotelId}`);
        const data = await response.json();
        setHotel(data);
        // Initialize selectedRooms with all room types set to 0
        setSelectedRooms(
          data.availableRooms.map((room) => ({
            type: room.type,
            count: 0,
            price: room.price,
            noOfBeds: room.noOfBeds,
            bed: room.bed,
          }))
        );
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [hotelId]);

  const handleRoomCountChange = (index, value) => {
    const newSelectedRooms = [...selectedRooms];
    const maxRooms = hotel.availableRooms[index].quantity || 0;
    newSelectedRooms[index].count = Math.max(0, Math.min(Number(value), maxRooms));
    setSelectedRooms(newSelectedRooms);
  };

  const handleBookNow = async () => {
    // Filter out rooms with count > 0
    const roomsToBook = selectedRooms.filter((room) => room.count > 0);
    if (roomsToBook.length === 0) {
      await Swal.fire({
        title: 'No Rooms Selected',
        text: 'Please select at least one room to proceed with the booking.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: `btn ${Style['conbtn']}`,
        }
      });
      return;
    }
    setBookedHotel(hotel);
    navigate('/booking-form', { state: { hotel, selectedRooms: roomsToBook } });
  };

  const renderStars = (rating) => {
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
      <StepsBar currentStep={1} />
      <button className="btn mb-4" onClick={() => navigate(-1)}>
        ← Back to Hotels
      </button>
      <h2 className='text-center'>Choose Your Rooms</h2>

      <div className="card mb-5 shadow">
        <div className="row g-0 rounded-2">
          <div className="col-lg-6 rounded-start" style={{ height: '450px' }}>
            <Slider {...settings}>
              <div className='w-100'>
                <img
                  src={`/${hotel.image}`}
                  alt={hotel.name}
                  className="w-100 rounded-start"
                  style={{ height: '450px' }}
                />
              </div>
              {hotel?.roomsImages?.map((image, index) => (
                <div key={index}>
                  <img
                    src={`/${image}`}
                    alt={hotel.name}
                    className="w-100 rounded-start"
                    style={{ height: '450px' }}
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-lg-6" style={{ height: '450px' }}>
            <div className={`${Style['card-body']} px-5 py-2`}>
              <h2 className="card-title mb-2">{hotel.name}</h2>
              <div className="mb-3 d-flex align-items-center">
                <div className="me-2">{renderStars(hotel.rate)}</div>
                <strong>{hotel.rate}</strong>
              </div>
              <p className="card-text">{hotel.description}</p>
              <p className="mt-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                <strong>Location:</strong> {hotel.city}
              </p>
              <div className="mb-2">
                <h5 className="mb-3">Hotel Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, index) => (
                    <span key={index} className={`badge p-2 px-3 ${Style['amenity-badge']}`}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className={`${Style['rooms']} `}>
        <h2 className="text-center">Rooms</h2>

        <div className={`${Style['room-table']}`}>
          <button
            className={`${Style['bookHotel-button']}`}
            onClick={handleBookNow}
          >
            Book Now
          </button>
          <table className={`table ${Style['room-card']} table-bordered table-hover `}>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Number of guests</th>
                <th>Price</th>
                <th>options</th>
                <th>Add Room</th>
              </tr>
            </thead>

            <tbody>
              {hotel.availableRooms.map((room, index) => (
                <tr key={index} className={`${Style['room']}`}>
                  <td><p><strong>Room Type:</strong> {room.type}</p>
                    <p><strong>Bed:</strong> {room.bed}</p>
                    <p><strong>No.Beds: </strong> {room.noOfBeds}</p>
                    {room.type === "single" ? (
                      <>
                        <span><i className='fas fa-snowflake'></i> Air Conditioner</span>
                        <span className='mx-2'> <i className='fas fa-bath'></i> attached bathroom</span>
                        <span> <i className='fas fa-tv'></i> flat-screen TV</span>
                      </>
                    ) : (
                      <>
                        <span><i className='fas fa-snowflake'></i> Air Conditioner</span>
                        <span className='mx-2'> <i className='fas fa-bath'></i> attached bathroom</span>
                        <span> <i className='fas fa-tv'></i> flat-screen TV</span>
                        <span className='mx-2'> <i className='fas fa-utensils'></i> kitchenette</span>
                        <span> <i className='fas fa-coffee '></i> Minibar</span>
                        <span></span>

                      </>
                    )}

                  </td>
                  <td>{room.noOfBeds === 1 ? <i className='fas fa-user'></i> :
                    room.noOfBeds === 2 ? <span><i className='fas fa-user me-2'></i><i className='fas fa-user'></i></span> : <span><i className='fas fa-user'></i><i className='fas fa-user mx-2'></i><i className='fas fa-user'></i></span>}</td>



                  <td>${room.price}</td>
                  <td>
                    {room.type === "single" ? (
                      <>
                        <p>Contain breakfast</p>
                      </>
                    ) : (
                      <>
                        <p>Contain breakfast and dinner</p>
                      </>
                    )}
                    <p>Free cancellation</p>
                  </td>

                  <td>
                    <input
                      type="number"
                      min={0}
                      max={room.quantity}
                      value={selectedRooms[index]?.count || 0}
                      onChange={(e) => handleRoomCountChange(index, e.target.value)}
                      className="form-control"
                      aria-label="Add Room"
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3 rounded-3 overflow-hidden">
          <iframe
            className="rounded-3"
            src={hotel.location}
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
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
            <div className="col-md-12 mb-3">
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