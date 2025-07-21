import React, { createContext, useState } from 'react'


export let FlightContext = createContext()

export default function FlightContextProvider({ children }) {

 let headers = {
            token : localStorage.getItem('token')
        } 
    



  const [numberOfPersons, setNumberOfPersons] = useState(1); // ⬅️ أضف دي

 const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight ,numberOfPersons, setNumberOfPersons }}>
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  return useContext(flightContext);
}

