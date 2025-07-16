import React, { createContext, useState } from 'react'


export let FlightContext = createContext()

export default function FlightContextProvider({ children }) {

 let headers = {
            token : localStorage.getItem('token')
        } 
    




 const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  return useContext(flightContext);
}

