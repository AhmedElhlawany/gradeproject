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
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function OverView() {
  const [profitData, setProfitData] = useState({
    totalProfit: 0,
    flightProfit: 0,
    hotelProfit: 0,
    monthlyProfits: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/api/users', {
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
        console.log("data " , data);
        
        
        let flightProfit = 0;
        let hotelProfit = 0;
        const monthlyProfits = {};

        users.forEach((user) => {
          (user.bookedFlights || []).forEach((flight) => {
            const profit = flight.price * (flight.adults + flight.children) * 0.1;
            flightProfit += profit;

            const date = new Date(flight.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyProfits[monthYear] = (monthlyProfits[monthYear] || 0) + profit;
          });

          (user.bookedHotels || []).forEach((hotel) => {
            const profit = hotel.totalCost * 0.1;
            hotelProfit += profit;

            const date = new Date(hotel.bookingDate);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyProfits[monthYear] = (monthlyProfits[monthYear] || 0) + profit;
          });
        });

        console.log('Flight Profit:', flightProfit);
        console.log('Hotel Profit:', hotelProfit);
        console.log('Monthly Profits:', monthlyProfits);

        setProfitData({
          totalProfit: flightProfit + hotelProfit,
          flightProfit,
          hotelProfit,
          monthlyProfits,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

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

  return (
    <div className="container py-4">

      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Total Profit</h2>
              <p className="card-text text-success fs-4">${profitData.totalProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Flight Profit</h2>
              <p className="card-text text-primary fs-4">${profitData.flightProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5">Hotel Profit</h2>
              <p className="card-text text-danger fs-4">${profitData.hotelProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5 mb-3">Monthly Profit Trend</h2>
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
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h5 mb-3">Profit Distribution</h2>
              <div style={{ position: 'relative' }}>
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
      </div>
    </div>
  );
}
