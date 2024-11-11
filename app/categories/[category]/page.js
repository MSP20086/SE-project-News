'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/ArticleCard2";
import PaginationComponent from "@/components/Pagination";
import useArticleInteractions from "@/hooks/useArticleInteractions"; 
import { useSession } from "next-auth/react";
import axios from 'axios';
import Loading from "@/components/Loading";  // Import Loading component

export default function NewsPage() {
  const { category } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const articlesPerPage = 15;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const { articles, setArticles, handleLike, handleDislike, handleBookmark } = useArticleInteractions();

  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const apiUrl = category === "foryou" 
          ? `/api/getRecommendations?userId=${userId}`  
          : `/api/getCategoryNews?category=${category}`;  
        
        const response = await axios.get(apiUrl);
        const fetchedArticles = response.data.articles || [];
        
        if (userId) {
          const interactionsResponse = await axios.get(`/api/getUserInteraction?userId=${userId}`);
          const interactionsData = interactionsResponse.data;
          const interactionsMap = interactionsData.reduce((acc, interaction) => {
            const { articleId, type } = interaction;
            acc[articleId] = acc[articleId] || { liked: false, disliked: false, bookmarked: false };

            if (type === 'like') {
              acc[articleId].liked = true;
            } else if (type === 'dislike') {
              acc[articleId].disliked = true;
            } else if (type === 'bookmark') {
              acc[articleId].bookmarked = true;
            }
            return acc;
          }, {});

          const updatedArticles = fetchedArticles.map(article => ({
            ...article,
            liked: interactionsMap[article._id]?.liked || false,
            disliked: interactionsMap[article._id]?.disliked || false,
            bookmarked: interactionsMap[article._id]?.bookmarked || false,
          }));

          setArticles(updatedArticles);
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    setCurrentPage(1);
  }, [category, userId]); 
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold capitalize mb-6">{category} News</h1>

      {loading ? ( 
        <Loading />  
      ) : (
        <div className="space-y-6">
          {currentArticles.length > 0 ? (
            currentArticles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onLike={() => handleLike(article._id)}
                onDislike={() => handleDislike(article._id)}
                onBookmark={() => handleBookmark(article._id)}
              />
            ))
          ) : (
            <p>No articles found for this category.</p>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
