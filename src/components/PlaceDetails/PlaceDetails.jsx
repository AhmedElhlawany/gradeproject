import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    fetch(`http://flyhigh.zeabur.app/api/places/${id}`)
      .then(res => res.json())
      .then(data => setPlace(data))
      .catch(err => {
        console.error("Error fetching place details:", err);
        setPlace(null);
      });
  }, [id]);

  if (!place) return <p>Place not found.</p>;

  return (
    <>
    <div className="pt-5">
    <div className="container py-5 mt-5">
      <div className="row">
        <div className="col-md-4 col-sm-12">
          <img src={`/${place.image}`} alt={place.name} className="w-100 rounded-2"/>

        </div>
        <div className="col-md-8 col-sm-12 p-5">
          <h1>{place.name}</h1>
          <p>{place.description || "No description available."}</p>
         
        </div>

      </div>
     
    </div>
    </div>
    </>
  );
}
