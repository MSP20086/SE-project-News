"use client"
import ArticleCard from './ArticleCard';

const LatestNews = ({ articles }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-extrabold mb-6 text-center text-5xl">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            imageUrl={article.image_url}
            category={article.category}
            slug={article._id}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
