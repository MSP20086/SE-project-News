"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import useLocation from '@/hooks/useLocation';
import { fetchWeatherData } from '@/lib/weather';

export default function Hero() {
  const { location, error: locationError } = useLocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      if (location) {
        try {
          const weatherData = await fetchWeatherData(location.latitude, location.longitude);
          setWeather(weatherData);
        } catch (err) {
          setError(`Error fetching weather data: ${err.message}`);
        }
      }
    };

    getWeather();
  }, [location]);

  console.log(weather)

  return (
    <section className="bg-gray-50 py-12 md:py-20 w-full flex flex-col md:flex-row">
      <div className="container mx-auto px-4 w-full md:w-3/4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Breaking: Major Climate Agreement Reached
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  World leaders have come to a landmark decision on reducing global carbon emissions, 
                  setting ambitious targets for the next decade.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/article/climate-agreement">Read Full Story</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/category/environment">More News</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src="https://api.time.com/wp-content/uploads/2024/10/The-LG-Signature-OLED-T.jpeg?quality=85&w=1920"
                  alt="World leaders shaking hands after climate agreement"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='container mx-auto px-4 w-full md:w-1/4 mt-10 lg:mt-0'>
        <div className="mb-5">
			<Card className="overflow-hidden bg-gradient-to-r bg-white text-black shadow-lg rounded-lg p-3">
				<CardContent className="flex flex-col items-center">
					<h1 className="text-3xl font-bold text-black">Weather</h1>
					{locationError && <p className="text-red-500">{locationError}</p>}
					{error ? (
					<p className="text-red-500">{error}</p>
					) : weather ? (
					<div className="flex items-center justify-between w-full">
						{/* Weather Icon */}
						<div className="flex items-center">
						<img 
							src={weather.current.condition.icon} 
							alt={weather.current.condition.text} 
							className="w-15 h-15 mr-4" 
						/>
						<div className="flex flex-col">
							<p className="text-lg font-semibold text-black">{weather.location.name}</p>
							<p className="text-4xl font-bold text-black">{Math.round(weather.current.temp_c)}°C, {weather.current.condition.text}</p>
						</div>
						</div>
					</div>
					) : (
					<p className="text-lg text-gray-600">Loading...</p>
					)}
				</CardContent>
			</Card>
        </div>
        {/* <div className="mb-5">
          <Card className="overflow-hidden bg-white shadow-lg rounded-lg p-6">
            <CardContent>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Latest News</h1>
              <ul className="space-y-2">
                {["news-1", "news-2", "news-3", "news-4", "news-5"].map((news, index) => (
                  <li key={index} className="flex items-center justify-between pb-2">
                    <Link href={`/article/${news}`} className="text-blue-600 hover:underline transition duration-200 text-lg font-semibold">
                      {`News Article ${index + 1}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
}
