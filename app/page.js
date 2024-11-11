"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import LatestNews from "../components/LatestNews";
const Loading = dynamic(() => import('../components/Loading'), { ssr: false });

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/getAllNews');
      
      if (response.status === 200) {
        setArticles(response.data.articles.slice(0, 12));
      } else {
        setError("Error fetching articles: " + response.data.error);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error error={new Error(error)} reset={() => {
    setError(null);
    setIsLoading(true);
    fetchArticles();
  }} />;

  return (
    <div>
      <Hero />
      <LatestNews articles={articles} />
    </div>
  );
}
