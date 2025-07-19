import React, { useEffect, useState } from 'react'
import Style from './Home.module.css'
import Airportpana from '../../assets/Departing-rafiki.png'
import axios, { Axios } from 'axios';
export default function Home() {


  const [flights, setFlights] = useState([]);
  const [token, setToken] = useState("");
  const [Places, setPlaces] = useState([])

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
function getPlaces(){
  axios.get(`http://localhost:3000/api/places`).then(res =>setPlaces(res.data));
  
  
}
 

  useEffect(() => {
    getAccessToken();
    getPlaces();
  }, []);

  useEffect(() => {
    if (token) {
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


          <h2 className={`${Style['popylar']} text-center`}>Popular <span>Destinations</span></h2>
         

<p className={`text-center text-secondary`}>Discover breathtaking locations around the world. From iconic landmarks to hidden gems.</p>

<div className="row  py-5">
{Places.slice(0, 3).map((place) => (
 <div key={place.id} className={`${Style['destinationsCard']} col-md-4 p-3`}>
  <div className={`${Style['card']}`}>
    <div className={`${Style['cardTop']} overflow-hidden d-flex align-items-center justify-content-center`}>
    {/* <img src="dubai.jpg" className='w-100' alt="" /> */}
    <h2>{place.city}</h2>

  </div>
  <div className={`${Style['cardContent']}`}>
  <ul>
    {place?.places?.map((place) => (
      <li key={place.id}><i className="fa-solid fa-camera"></i> {place.name}</li>
    ))}
  </ul>
  <div className={`d-flex align-items-center justify-content-end pt-2`}>

<button className={`${Style['explore']}`}>Explore</button>



  </div>
  </div>
  </div>
</div>
  ))}

</div>




        </div>
      </div>

      <div className='r'>

      </div>
    </>
  )
}
