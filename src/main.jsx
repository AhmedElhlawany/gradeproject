import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css'
import './index.css'
import App from './App.jsx'
import FlightContextProvider from './components/Context/FlightContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlightContextProvider >
    <App />
    </FlightContextProvider>
  </StrictMode>,
)
