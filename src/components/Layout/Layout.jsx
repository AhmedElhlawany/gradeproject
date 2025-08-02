
import Navbar from '../Navbar/Navbar'

import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import style from './Layout.module.css'

export default function Layout() {
  const isAdmin = JSON.parse(localStorage.getItem('currentUser'))?.email === 'ahmedelhalawany429@gmail.com';

  return (
    <>
      { <Navbar />}
      <div className={` mx-auto ${style['layout']}`}>
        <Outlet></Outlet>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}
