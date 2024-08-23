import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, []);

  return (
    <LocationContext.Provider value={{ locations, selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
