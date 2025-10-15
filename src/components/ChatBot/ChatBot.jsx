import { useContext, useState } from "react";
import style from "./ChatBot.module.css";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../Context/FlightContext";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful shopping assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { setSelectedFlight, setBookedHotel } = useContext(FlightContext);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://flyhigh.zeabur.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "No response";

      // Determine search intent
      const isFlightSearch = input.toLowerCase().includes("flight");
      const isHotelSearch = input.toLowerCase().includes("hotel");

      // Extract city and flight-specific details from input
      const cityMatch = input.match(/\bin\s+([A-Za-z\s]+)(?:\s|$)/i);
      const city = cityMatch ? cityMatch[1].trim() : null;

      // Extract "from" and "to" cities for flights (e.g., "flight from New York to London")
      const flightMatch = input.match(/from\s+([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+)/i);
      const from = flightMatch ? flightMatch[1].trim() : null;
      const to = flightMatch ? flightMatch[2].trim() : null;

      // Initialize filtered data
      let filteredData = { content: reply, flights: null, hotels: null };

      if (isFlightSearch && !isHotelSearch) {
        // Show only flights, filtered by "from" and "to" if specified
        filteredData.flights =
          from && to
            ? data.flights?.filter(
              (f) =>
                f.from?.toLowerCase().includes(from.toLowerCase()) &&
                f.to?.toLowerCase().includes(to.toLowerCase())
            )
            : data.flights;
      } else if (isHotelSearch && !isFlightSearch) {
        // Show only hotels, filtered by city if specified
        filteredData.hotels = city
          ? data.hotels?.filter((h) =>
            h.city.toLowerCase().includes(city.toLowerCase())
          )
          : data.hotels;
      } else if (isFlightSearch && isHotelSearch) {
        // Prioritize hotels, but include flights if "from" and "to" are specified
        filteredData.hotels = city
          ? data.hotels?.filter((h) =>
            h.city.toLowerCase().includes(city.toLowerCase())
          )
          : data.hotels;
        filteredData.flights =
          from && to
            ? data.flights?.filter(
              (f) =>
                f.from?.toLowerCase().includes(from.toLowerCase()) &&
                f.to?.toLowerCase().includes(to.toLowerCase())
            )
            : data.flights;
      }

      // Add AI reply with filtered data
      setMessages([...newMessages, { role: "assistant", ...filteredData }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (hotel) => {
    setBookedHotel(hotel);
    navigate(`/hotelDetails/${hotel.id}`);
  };

  return (
    <div className={style.chatbotContainer}>
      <div className={style.chatbotContent}>
        {messages
          .filter((m) => m.role !== "system")
          .map((msg, i) => (
            <div
              key={i}
              className={`${style.message} ${msg.role === "assistant" ? style.assistant : style.user
                }`}
            >
              {/* Show AI text */}
              <div>{msg.content.split("\n").map((line, j) => <p key={j}>{line}</p>)}
                <br />
               
              </div>

              {/* Render flights if present */}

              {msg.flights &&
                msg.flights.map((f, j) => (
                  <div
                    key={j}
                    className={style.clickableLine}
                    onClick={() => {
                      setSelectedFlight(f);
                      navigate("/myflights");
                    }}
                  >
                    <p className="text-decoration-underline  ">✈ {f.airline} - ${f.price} - {f.from} to {f.to}</p>
                  </div>
                  
                ))}

              {/* Render hotels if present */}
              {msg.hotels &&
                msg.hotels.map((h, j) => (
                  <div
                    key={j}
                    className={style.clickableLine}
                    onClick={() => handleBooking(h)}
                  >
                    
                      <p className="text-decoration-underline  ">{j + 1}: {h.name}</p>
                      
                    

                  </div>
                )

                )
              }

            </div>
          ))}

        {loading && <p className={style.typing}>Searching...</p>}
      </div>

      <div className={style.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}