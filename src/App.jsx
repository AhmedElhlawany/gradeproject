import { Suspense } from 'react';
import './App.css';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home';
import Notfound from './components/Notfound/Notfound';
import FlightSearch from './components/flightSearch/flightSearch';
import HotelSearch from './components/hotelSearch/hotelSearch';
import Places from './components/places/places';
import MyFlights from './components/MyFlights/MyFlights';
import FavoritesPage from './components/Favourite/Favourite';
import PrivacyAndTerms from './components/Terms/Terms';
import Payment from './components/Payment/Payment';
import Profile from './components/Profile/Profile';
import MyBookings from './components/MyBookings/MyBookings';
import Contact from './components/ContactUs/Contact';
import About from './components/AboutUs/About';
import PlaceDetails from './components/PlaceDetails/PlaceDetails';
import FaQs from './components/FAQs/FAQs';
import HotelDetails from './components/HotelDetails/HotelDetails';
import HotelPayment from './components/HotelPayment/HotelPayment';
import BoookedHotels from './components/BoookedHotels/BoookedHotels';
import Dashboard from './components/Dashboard/Dashboard/Dashboard';
import ViewFlights from './components/Dashboard/ViewFlights/ViewFlights';
import AddFlights from './components/Dashboard/AddFlights/AddFlights';
import AddHotels from './components/Dashboard/AddHotels/AddHotels';
import AddAirlines from './components/Dashboard/AddAirLine/AddAirlines';
import ViewHotels from './components/Dashboard/ViewHotels/ViewHotels';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FlightContextProvider from './components/Context/FlightContext';
import { FavoritesProvider } from './components/Context/FavouriteContext';

const adminroutes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          { element: <Navigate to="view-flights" replace /> },
          { path: 'add-flights', element: <AddFlights /> },
          { path: 'add-hotels', element: <AddHotels /> },
          { path: 'add-airlines', element: <AddAirlines /> },
          { path: 'view-flights', element: <ViewFlights /> },
          { path: 'view-hotels', element: <ViewHotels /> },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <Notfound /> },
    ],
  },
]);

const userroutes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense><Home /></Suspense> },
      { path: 'flights', element: <Suspense><FlightSearch /></Suspense> },
      { path: 'hotels', element: <Suspense><HotelSearch /></Suspense> },
      { path: 'places', element: <Suspense><Places /></Suspense> },
      { path: 'myflights', element: <Suspense><MyFlights /></Suspense> },
      { path: 'favorite', element: <Suspense><FavoritesPage /></Suspense> },
      { path: 'terms', element: <Suspense><PrivacyAndTerms /></Suspense> },
      { path: 'payment', element: <ProtectedRoute><Suspense><Payment /></Suspense></ProtectedRoute> },
      { path: 'hotellpayment', element: <ProtectedRoute><Suspense><HotelPayment /></Suspense></ProtectedRoute> },
      { path: 'myBookings', element: <ProtectedRoute><MyBookings /></ProtectedRoute> },
      { path: 'bookedHotels', element: <ProtectedRoute><BoookedHotels /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'contactUs', element: <ProtectedRoute><Contact /></ProtectedRoute> },
      { path: 'aboutUs', element: <ProtectedRoute><About /></ProtectedRoute> },
      { path: 'place/:id', element: <ProtectedRoute><PlaceDetails /></ProtectedRoute> },
      { path: 'hoteldetails/:id', element: <ProtectedRoute><HotelDetails /></ProtectedRoute> },
      { path: 'FAQs', element: <ProtectedRoute><FaQs /></ProtectedRoute> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <Notfound /> },
    ],
  },
]);

function App() {
  const isAdmin = JSON.parse(localStorage.getItem('currentUser'))?.email === "ahmedelhalawany429@gmail.com";
  const router = isAdmin ? adminroutes : userroutes;

  return (
    <div className="app-wrapper">
      <FlightContextProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </FlightContextProvider>
    </div>
  );
}

export default App;
