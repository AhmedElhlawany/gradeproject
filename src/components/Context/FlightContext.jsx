import React, { createContext, useState } from 'react'


export let FlightContext = createContext()

export default function FlightContextProvider({ children }) {

 let headers = {
            token : localStorage.getItem('token')
        } 
    


const [adults, setAdults] = useState(1);
  const [child, setChild] = useState(0);

 const [selectedFlight, setSelectedFlight] = useState(null);
 const [bookedHotel, setBookedHotel] = useState(null)

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight , adults, setAdults, child, setChild , bookedHotel, setBookedHotel, headers }}>
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  return useContext(flightContext);
}

