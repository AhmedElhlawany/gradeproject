
import Navbar from '../Navbar/Navbar'

import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import style from './Layout.module.css'
import ChatBot from '../ChatBot/ChatBot';
import { FaComments } from "react-icons/fa";
import { useState } from 'react';

export default function Layout() {
    const [isChatOpen, setIsChatOpen] = useState(false);

  const isAdmin = JSON.parse(localStorage.getItem('currentUser'))?.email === 'ahmedelhalawany429@gmail.com';

  return (
    <>
      { <Navbar />}
      <div className={`mx-auto ${style.layout}`}>
      <Outlet />

      {/* Floating Chat Button */}
      <button
        className={style.chatButton}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <FaComments />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className={style.chatWindow}>
          <ChatBot />
        </div>
      )}
    </div>
      {!isAdmin && <Footer />}
    </>
  );
}
