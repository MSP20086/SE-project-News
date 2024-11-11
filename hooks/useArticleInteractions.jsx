// hooks/useArticleInteractions.js
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const useArticleInteractions = (initialArticles = []) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [articles, setArticles] = useState(initialArticles);

  const handleLike = async (_id) => {
    try {
      const response = await axios.post(`/api/handleLikes`, {
        articleId: _id,
        userId: userId,
        action: 'like',
      });

      if (response.status !== 200) {
        throw new Error('Failed to like the article');
      }

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === _id
            ? { ...article, liked: !article.liked, disliked: false }
            : article
        )
      );
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleDislike = async (_id) => {
    try {
      const response = await axios.post(`/api/handleLikes`, {
        articleId: _id,
        userId: userId,
        action: 'dislike',
      });

      if (response.status !== 200) {
        throw new Error('Failed to dislike the article');
      }

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === _id
            ? { ...article, disliked: !article.disliked, liked: false }
            : article
        )
      );
    } catch (error) {
      console.error("Error disliking article:", error);
    }
  };

  const handleBookmark = async (_id) => {
    try {
      const response = await axios.post(`/api/handleBookmarks`, {
        articleId: _id,
        userId: userId,
      });

      if (response.status !== 200) {
        throw new Error('Failed to bookmark the article');
      }

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === _id
            ? { ...article, bookmarked: !article.bookmarked }
            : article
        )
      );
    } catch (error) {
      console.error("Error bookmarking article:", error);
    }
  };

  return { articles, handleLike, handleDislike, handleBookmark, setArticles };
};

export default useArticleInteractions;
