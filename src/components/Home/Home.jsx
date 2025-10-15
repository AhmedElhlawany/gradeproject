import React, { useEffect, useState } from 'react'
import Style from './Home.module.css'
import Airportpana from '../../assets/Departing-rafiki.png'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
export default function Home() {


  const [token, setToken] = useState("");
  const [Places, setPlaces] = useState([])

  
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

function getUsers() {
  const token = localStorage.getItem("token"); 

  axios
    .get("https://flyhigh.zeabur.app/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {console.log(res.data);
      let userHotels =res.data.map((user) => console.log(
       user.bookedHotels))
      let userFlights =res.data.bookedFlights
      console.log(userHotels,userFlights);
      
    })
    .catch((err) => console.error("Error fetching users:", err.response?.data || err.message));
}



  function getPlaces() {
    axios.get(`https://flyhigh.zeabur.app/api/places`).then(res => setPlaces(res.data));


  }


  useEffect(() => {
    // getAccessToken();
    getPlaces();
    getUsers();
  }, []);

  useEffect(() => {
    if (token) {
    }
  }, [token]);
  return (
    <>

      <div className={`${Style['home']} text-center m-0 d-flex justify-content-center align-items-center position-relative`}>
        <video src="home.mp4" autoPlay loop muted width={"100%"}  className="homeVid"></video>
        <div className={`${Style['overlay']} position-absolute`}></div>
        <div className={`${Style['header']} position-absolute `}>
          <h1 className='text-light'>Explore the <span>World </span>
            Your Way</h1>

          <p className=' fs-3 '>Discover amazing destinations, book flights & hotels, and create unforgettable memories with our travel platform.</p>


          <div className={`${Style["heroButtons"]}`}>
            <button className={`me-3 btn ${Style['btn-Hbook']} px-4`} > <Link to="/flights"> Book Now </Link></button>
            <button className='me-3 px-4 text-light btn btn-secondary'> <Link to="/hotels">Explore</Link></button>
          </div>


        </div>


      </div>


      <div className={`${Style['provide']}`}>

        <div className="container">
          <div className="row">
            <div className="col-md-6 p-5">
              <img src={Airportpana} alt="" className='w-100' />
            </div>
            <div className="col-md-6 p-5">
              <h2 className='pt-0'>We <span>provide</span> the best </h2>

              <ul>
                <li className='d-flex align-items-center'>
                  <div className={`${Style['icondiv']}`}><i className="fa-solid fa-code-compare me-2"></i></div>
                  Search and Compare
                </li>
                <li className='d-flex align-items-center'>
                  <div className={`${Style['icondiv']}`}>
                    <i className="fa-solid fa-comment me-2"></i>

                  </div>
                  Customer reviews
                </li>
                <li className='d-flex align-items-center'>
                  <div className={`${Style['icondiv']}`}>
                    <i className="fa-solid fa-money-check me-2"></i>

                  </div>

                  online check-in

                </li>
                <li className='d-flex align-items-center'>
                  <div className={`${Style['icondiv']}`}>
                    <i className="fa-solid fa-earth-americas me-2"></i>

                  </div>
                  multi cities
                </li>
                <li className='d-flex align-items-center'>
                  <div className={`${Style['icondiv']}`}>
                    <i className="fa-solid fa-plane-departure me-2"></i>

                  </div>
                  flight tracking
                </li>
              </ul>


            </div>



          </div>
        </div>




      </div>





      <div >



        <div className="container pb-5">


          <h2 className={`${Style['popular']} text-center`}>Popular <span>Destinations</span></h2>


          <p className={`text-center text-secondary`}>Discover breathtaking locations around the world. From iconic landmarks to hidden gems.</p>

 <Slider {...settings}>
  {Places.map((place) => (
    <div key={place.id} className={`${Style['destinationsCard']} p-3`}>
      <div className={Style['card']}>
        <div className={`${Style['cardTop']} overflow-hidden d-flex align-items-center justify-content-center`}>
          <img src={place.image} className="w-100 h-100" alt={`Image of ${place.city}`} />
        </div>
        <div className={Style['cardContent']}>
          <h2>{place.city}</h2>
          <ul>
            {place?.places?.map((subPlace) => (
              <li key={subPlace.id}>
                <i className="fa-solid fa-location-dot"></i> {subPlace.name}
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center justify-content-end pt-2">
            <Link to="/flights" className={`${Style['explore']} w-100 btn btn-primary text-decoration-none text-light`}>
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  ))}
</Slider>

         
        </div>




      </div>


    </>
  )
}
