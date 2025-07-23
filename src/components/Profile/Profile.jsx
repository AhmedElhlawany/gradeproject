import React from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    return <p>No user is logged in.</p>;
  }

  return (
    <>
    <div className='profile pt-5'>
 <div className="container mt-5">
  <div className="row">
    <div className="col-md-6">  
       <h2>Welcome, {user.name}</h2>

       <h4> <Link to="/myBookings">My Flights</Link></h4>
    </div>
    <div className="col-md-6">  
<h2>General Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  </div>

     

      
    </div>
    </div>
   
    </>
  );
}
