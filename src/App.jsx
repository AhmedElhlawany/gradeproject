import { Suspense } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home';
import Notfound from './components/Notfound/Notfound';
import FlightSearch from './components/flightSearch/flightSearch';
import HotelSearch from './components/hotelSearchh/hotelSearch';
import Places from './components/places/places';
import MyFlights from './components/MyFlights/MyFlights';
import FavoritesPage from './components/Favourite/Favourite';
import PrivacyAndTerms from './components/Terms/Terms';
import Payment from './components/Payment/Payment';

let routes = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'flights',
        element: (
          <Suspense>
            <FlightSearch />
          </Suspense>
        ),
      },
      {
        path: 'hotels',
        element: (
          <Suspense>
            <HotelSearch />
          </Suspense>
        ),
      },
      {
        path: 'places',
        element: (
          <Suspense>
            <Places />
          </Suspense>
        ),
      },
      {
        path: 'myflights',
        element: (
          <Suspense>
            <MyFlights />
          </Suspense>
        ),
      },
      {
        path: 'favourite',
        element: (
          <Suspense>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense>
            <PrivacyAndTerms />
          </Suspense>
        ),
      },
      {
        path: 'payment',
        element: (
          <Suspense>
            <Payment />
          </Suspense>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <Notfound /> },
    ],
  },
]);

function App() {
  return (
    <div className="app-wrapper">
      <RouterProvider router={routes}></RouterProvider>
    </div>
  );
}

export default App;