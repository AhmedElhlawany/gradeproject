import React, { useEffect, useState } from 'react'
import Style from './Footer.module.css'
export default function Footer() {


  return (
    <>
      <div className={`footer text-center ${Style['footer']}`}>
        <div className="container w-75">
          <h2>Fly High</h2>
          <p>Flight booking websites serve as online platforms where travelers can purchase airline tickets for various routes and process, offering price comparisons, and enabling customizable travel experiences.</p>

          <div className={`${Style['isons']} d-flex justify-content-center align-items-center gap-3`}>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-facebook"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-instagram"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-x-twitter"></i></div>
            <div className={`${Style['icon']}`}><i className="fa-brands fa-google"></i></div>

          </div>





        </div>
      </div>
    </>
  )
}
