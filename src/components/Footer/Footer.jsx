import React, { useEffect, useState } from 'react'
import Style from './Footer.module.css'
import { Link } from 'react-router-dom'
export default function Footer() {


  return (
    <>
      <div className={`footer text-center ${Style['footer']}`}>
        <div className="container ">
          <div className="row">
<div className="col-md-6 col-sm-12"> <h2>Fly High</h2>
          <p>Flight booking websites serve as online platforms where travelers can purchase airline tickets for various routes and process, offering price comparisons, and enabling customizable travel experiences.</p>

          <div className={`${Style['isons']} d-flex justify-content-center align-items-center gap-3`}>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-facebook"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-instagram"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-x-twitter"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-google"></i></div>

          </div></div>
<div className="col-md-6 col-sm-12">
  <ul className='text-start'>
    <li>
      <Link to="/terms">Terms & Privacy</Link>
    </li>
   
    <li>
      <Link to="/contactUs">Contact Us</Link>
    </li>
    <li>
      <Link to="/aboutUs">About Us</Link>
    </li>
    <li>
      <Link to="/FAQs">FAQs</Link>
    </li>
  </ul>
</div>

          </div>
         





        </div>
      </div>
    </>
  )
}
