import axios from 'axios';

const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

export const fetchWeatherData = async (latitude, longitude) => {
    const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; 
  
    const url = `${BASE_URL}?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`;
    const response = await axios.get(url);
    console.log(response.data)
    return response.data; 
};
