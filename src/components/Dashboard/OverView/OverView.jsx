import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
import style from './OverView.module.css'


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function OverView() {
  const [profitData, setProfitData] = useState({
    totalProfit: 0,
    flightProfit: 0,
    hotelProfit: 0,
    monthlyProfits: {},
  });
  const [userBookings, setUserBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noHotels, setNoHotels] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://flyhigh.zeabur.app/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(
            res.status === 401 ? 'Unauthorized: Invalid or missing token' : 'Failed to fetch data'
          );
        }

        const data = await res.json();
        const users = data || [];
        console.log('Users:', users);
        console.log('Data:', data);

        // get number of users
        const numUsers = users.length;
        console.log('Number of users:', numUsers);



        let flightProfit = 0;
        let hotelProfit = 0;
        const monthlyProfits = {};
        const userBookingsData = {};

        users.forEach((user) => {
          const userIdentifier = user.name || user.email || `User ${user.id}`;
          const flightCount = (user.bookedFlights || []).length;
          const hotelCount = (user.bookedHotels || []).length;
          userBookingsData[userIdentifier] = flightCount + hotelCount;

          (user.bookedFlights || []).forEach((flight) => {
            const profit = flight.price  * 0.1;
            flightProfit += profit;

            const date = new Date(flight.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyProfits[monthYear] = (monthlyProfits[monthYear] || 0) + profit;
          });

          (user.bookedHotels || []).forEach((hotel) => {
            const profit = hotel.totalCost * 0.1;
            hotelProfit += profit;

            const date = new Date(hotel.checkIn);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyProfits[monthYear] = (monthlyProfits[monthYear] || 0) + profit;
          });
        });

        console.log('Flight Profit:', flightProfit);
        console.log('Hotel Profit:', hotelProfit);
        console.log('Monthly Profits:', monthlyProfits);
        console.log('User Bookings:', userBookingsData);
        
        setProfitData({
          totalProfit: flightProfit + hotelProfit,
          flightProfit,
          hotelProfit,
          monthlyProfits,
        });
        setUserBookings(userBookingsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    //get number of hotels
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://flyhigh.zeabur.app/api/hotels');
        if (!response.ok) {
          throw new Error(`Failed to fetch hotels: ${response.status}`);
        }
        const data = await response.json();
          const   numHotels = data.length;
        console.log('Number of hotels:', numHotels);
        setNoHotels(numHotels);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      }
    };


    fetchHotels();
    fetchData();
  }, []);


  const sortedMonths = Object.keys(profitData.monthlyProfits).sort(
    (a, b) => new Date(Date.parse(a)) - new Date(Date.parse(b))
  );

  const barChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Monthly Profits ($)',
        data: sortedMonths.map((month) => profitData.monthlyProfits[month]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
       
      },
    ],
  };

  const pieChartData = {
    labels: ['Flights', 'Hotels'],
    datasets: [
      {
        data: [profitData.flightProfit, profitData.hotelProfit],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const userChartData = {
    labels: Object.keys(userBookings),
    datasets: [
      {
        label: 'Total Bookings (Flights + Hotels)',
        data: Object.values(userBookings),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <p className="text-muted h5">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4 text-center">
        <p className="text-danger h5">{error}</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (
    profitData.totalProfit === 0 &&
    Object.keys(profitData.monthlyProfits).length === 0 &&
    Object.keys(userBookings).length === 0
  ) {
    return (
      <div className="container py-4 text-center">
        <p className="text-muted h5">No booking data or users available to display.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 g-4 mb-4">
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5"><i className="fa-solid fa-sack-dollar me-2"></i> Total Profit</h2>
              <p className="card-text text-success fs-4"> ${profitData.totalProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5"><i className="fa-solid fa-plane-departure me-2"></i> Flight Profit</h2>
              <p className="card-text text-primary fs-4">${profitData.flightProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5"> <i className="fa-solid fa-hotel me-2"></i> Hotel Profit</h2>
              <p className="card-text  fs-4">${profitData.hotelProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5"> <i className="fa-solid fa-users me-2"></i> Number of users</h2>
              <p className="card-text  fs-4">{Object.keys(userBookings).length} users</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5"> <i className="fa-solid fa-hotel me-2"></i> Number of Hotels</h2>
              <p className="card-text  fs-4">{noHotels} Hotels</p>
            </div>
          </div>
        </div>

      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5 mb-3"><i className="fa-solid fa-chart-line me-2"></i> Monthly Profits</h2>
              <div style={{ position: 'relative' }}>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Monthly Profits' },
                    },
                  }}
                />
              </div>
            </div>
          </div>


        
        </div>
        <div className="col">
          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h2 className="card-title h5 mb-3"><i className="fa-solid fa-chart-pie me-2"></i> Profit Distribution</h2>
              <div style={{ position: 'relative', height: '285px' }}>
                <Pie
              
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Profit by Category' },
                    },
                   
                    
                  }}
                  
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
           <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h2 className="card-title h5 mb-3"><i className="fa-solid fa-users me-2"></i> User Booking Activity</h2>
              <div style={{ position: 'relative' }}>
                <Bar
                  data={userChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Bookings per User' },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}