import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    const showPosition = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (error) => {
      setError(`Error getting location: ${error.message}`);
    };

    getUserLocation();
  }, []);

  return { location, error };
};

export default useLocation;
