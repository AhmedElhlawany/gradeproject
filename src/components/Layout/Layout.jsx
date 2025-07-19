
import Navbar from '../Navbar/Navbar'

import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import style from './Layout.module.css'

export default function Layout() {




    return (
    <>
    <Navbar/>

      <div className={` mx-auto ${style['layout']}`}>
        <Outlet></Outlet>
      </div>
    
    <Footer/>

    </>
  )
}
