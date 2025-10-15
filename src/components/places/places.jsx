import React, { useEffect, useState } from 'react';
import Style from './places.module.css';
import { useNavigate } from 'react-router-dom';

export default function Places({ city }) {
  const [places, setPlaces] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    if (city) {
      console.log('Fetching places for city:', city); 
      fetch(`http://flyhigh.zeabur.app/api/places?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
          console.log('API response:', data);
          
            setPlaces(data);
        })
        .catch(error => {
          console.error('Error fetching places:', error);
          setPlaces([]);
        });
    }
  }, [city]);

  if (!city) return null;

  return (

    <>

    <div className={`${Style['places']} container d-flex flex-wrap justify-content-between`}>

      {places?.length > 0 ? (
        places?.map(place => (
          <div key={place.id} className={`${Style['placecard']} text-center`}
           onClick={() => navigate(`/place/${place.id}`)}
           >
            <img className='w-100' src={place.image} alt={place.name} onError={() => console.log(`Failed to load image: ${place.image}`)} />
            <h4 className='py-2'>{place.name}</h4>
          </div>
        ))
      ) : (
        <p>No places found for {city}.</p>
      )}
    </div>

    </>
  );
}
