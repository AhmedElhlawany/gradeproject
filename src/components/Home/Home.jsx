import React, { useEffect, useState } from 'react'
import Style from './Home.module.css'
import Airportpana from '../../assets/Departing-rafiki.png'
import axios from 'axios';
export default function Home() {


  const [flights, setFlights] = useState([]);
  const [token, setToken] = useState("");

  const client_id = "s7YKywfPV4vZaM0scicmt217efz3kWKz ";
  const client_secret = "AUkxfV94aMiqcCWc";

  const getAccessToken = async () => {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      })
    );
    setToken(response.data.access_token);
  };

  const searchFlights = async () => {
    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: "CAI",
          destinationLocationCode: "DXB",
          departureDate: "2025-07-10",
          adults: 1,
          max: 5,
        },
      }
    );
    setFlights(response.data.data);
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (token) {
      searchFlights();
    }
  }, [token]);
  return (
    <>

      <div className={`${Style['home']} text-center m-0 d-flex justify-content-center align-items-center`}>

        <div className={`${Style['header']}`}>
          <h1 className='text-light'>Explore the <span>World </span>
            Your Way</h1>

          <p className=' fs-3 fw-bolder'>Discover amazing destinations, book flights & hotels, and create unforgettable memories with our travel platform.</p>
        </div>


      </div>


      <div className="provide">

        <div className="container py-5">
          <div className="row">
            <div className="col-md-6 p-5">
              <img src={Airportpana} alt="" className='w-100' />
            </div>
            <div className="col-md-6 p-5">
              <h2 className='pt-0'>We <span>provide</span> the best </h2>

              <ul>
                <li>
                  <i className="fa-solid fa-code-compare me-2"></i>
                    Search and Compare
                  <p>allows you to compare prices and find the best deals</p>
                </li>
                <li>
                  <i className="fa-solid fa-comment me-2"></i>
                  Customer reviews
                  <p>customer reviews and ratings help you make informed decisions</p>
                </li>
                <li>
                  <i className="fa-solid fa-money-check me-2"></i>
                  online check-in
                  <p>
                    allows you to check-in online and save time
                  </p>
                </li>
                <li>
                  <i className="fa-solid fa-earth-americas me-2"></i>
                  multi cities
                  <p>allows you to book flights to multiple destinations</p>
                </li>
                <li>
                  <i className="fa-solid fa-plane-departure me-2"></i>
                  flight tracking
                  <p>allows you to track your flights in real-time</p>
                </li>
              </ul>


            </div>



          </div>
        </div>




      </div>





      <div >
        <div className="container">


          <h2>trending flights</h2>
          {flights.length > 0 ? (
            flights.map((flight, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
                className={`d-flex justify-content-between align-items-center flex-wrap ${Style['flights']}`}
              >
                <p className={`${Style['from']}`}>

                  {flight.itineraries[0].segments[0].departure.iataCode}
                </p>
                <i class="fa-solid fa-plane"></i>

                <p className={`${Style['to']} text-end`}>

                  {
                    flight.itineraries[0].segments[
                      flight.itineraries[0].segments.length - 1
                    ].arrival.iataCode
                  }
                </p>
                <p>
                  <strong>price:</strong> {flight.price.total} {flight.price.currency}
                </p>
              </div>
            ))
          ) : (
            <p>loading ...</p>
          )}
        </div>
      </div>

      <div className='r'>

      </div>
    </>
  )
}
