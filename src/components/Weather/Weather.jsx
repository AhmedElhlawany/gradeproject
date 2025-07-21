import { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function WeatherCard({ city, date }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const getDayName = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
  };

  useEffect(() => {
    if (!city || !date) return;

    const API_KEY = "fe929c8b878144e880e225611231508";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`;

    axios
      .get(url)
      .then((res) => {
        const forecastList = res.data.forecast.forecastday;

        // نحدد أول يوم رحلة
        const startIndex = forecastList.findIndex((d) => d.date === date);
        if (startIndex !== -1) {
          const threeDays = forecastList.slice(startIndex, startIndex + 3);
          console.log("threeDays:", threeDays);
          
          setWeather({
            ...res.data,
            forecast: { forecastday: threeDays },
            
          });
        } else {
          setWeather(res.data);
        }
      })
      .catch(() => setError("Failed to fetch weather data"));
  }, [city, date]);

  if (error) return <div className="weather-card">Error: {error}</div>;

  if (!weather)
    return (
      <div className="d-flex justify-content-center my-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const { location, forecast } = weather;

  return (
    <div className="weather-card my-3 p-5 mx-4">
      <div className="header mb-4">
        <div className="d-flex gap-3 align-items-center">
          <FontAwesomeIcon
            icon={faLocationDot}
            style={{ fontSize: 25, color: "black", marginTop: 5 }}
          />
          <h3 className="text-warning">{location.name}</h3>
        </div>
        <hr style={{ width: 150, color: "#f0f0f0" }} />
      </div>

      <div className="container">
        <div className="row">
          {/* Forecast Container */}
          <div className="col-md-12">
            <div className="weather-area my-2">
              <div className="row">
                {forecast.forecastday.map((day) => (
                  <div key={day.date} className="col-md-4">
                    <div className="day my-3 p-3 position-relative border rounded text-center bg-white">
                      <div className="fw-bold mb-2">
                        {day.date === date ? "🟢 Your Trip Day" : getDayName(day.date)}
                      </div>
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        style={{ width: "80px", height: "80px" }}
                      />
                      <h3 className="my-2">{day.day.avgtemp_c}°C</h3>
                      <div>{day.day.condition.text}</div>
                      <div className="text-muted small mt-2">{day.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optional: activities area
          <div className="col-md-12">
            <div className="my-5 activities-area p-4 bg-light rounded">
              <div className="d-flex gap-2 mb-3">
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ fontSize: "24px", marginTop: 4 }}
                />
                <h4>Suggested Weather-Based Activities</h4>
              </div>

              <div className="row">
                <div className="col-lg-4 my-2">
                  <div className="card">
                    <img
                      src="https://source.unsplash.com/200x150/?hiking"
                      className="card-img-top"
                      alt="activity"
                    />
                    <div className="card-body">
                      <p className="card-text">Perfect weather for hiking or outdoor walks!</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 my-2">
                  <div className="card">
                    <img
                      src="https://source.unsplash.com/200x150/?museum"
                      className="card-img-top"
                      alt="activity"
                    />
                    <div className="card-body">
                      <p className="card-text">Visit indoor attractions like museums and galleries.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 my-2">
                  <div className="card">
                    <img
                      src="https://source.unsplash.com/200x150/?cafe"
                      className="card-img-top"
                      alt="activity"
                    />
                    <div className="card-body">
                      <p className="card-text">Chill in a cozy café and enjoy the view.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}
