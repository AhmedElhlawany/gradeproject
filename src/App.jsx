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
import ViewFlights from './components/Dashboard/ViewFlights/ViewFlights';
import AddFlights from './components/Dashboard/AddFlights/AddFlights';
import AddHotels from './components/Dashboard/AddHotels/AddHotels';
import AddAirlines from './components/Dashboard/AddAirLine/AddAirlines';
import ViewHotels from './components/Dashboard/ViewHotels/ViewHotels';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FlightContextProvider from './components/Context/FlightContext';
import { FavoritesProvider } from './components/Context/FavouriteContext';
import Users from './components/Dashboard/Users/Users';
import UsersBookedFlights from './components/Dashboard/UsersBookedFlights/UsersBookedFlights';
import UsersBookedHotels from './components/Dashboard/UsersBookedHotels/UsersBookedHotels';
import OverView from './components/Dashboard/OverView/OverView';
import Dashboard from './components/Dashboard/Dashboard/Dashboard';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import BookingForm from './components/BookingForm/BookingForm';

const adminroutes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '/dashboard/*',
        element: (
          <ProtectedRoute>
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
</ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="overview" replace /> }, 
          { path: 'add-flights', element: <AddFlights /> },
          { path: 'overview', element: <OverView /> },
          { path: 'add-hotels', element: <AddHotels /> },
          { path: 'add-airlines', element: <AddAirlines /> },
          { path: 'view-flights', element: <ViewFlights /> },
          { path: 'view-hotels', element: <ViewHotels /> },
          { path: 'users', element: <Users /> },
          { path: 'usersbookedflights', element: <UsersBookedFlights /> },
          { path: 'usersbookedhotels', element: <UsersBookedHotels /> },
        ],
      },
      { path: 'forgotpassword', element: <ForgotPassword /> },
      { path: 'resetpassword', element: <ResetPassword /> },
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
      { path: 'contactUs', element: <Contact /> },
      { path: 'aboutUs', element: <About /> },
      { path: 'place/:id', element: <PlaceDetails /> },
      { path: 'hoteldetails/:id', element: <HotelDetails /> },
      { path: 'FAQs', element: <FaQs /> },
      { path: 'booking-form', element: <ProtectedRoute><BookingForm /></ProtectedRoute> },
      { path: 'forgotpassword', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
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
