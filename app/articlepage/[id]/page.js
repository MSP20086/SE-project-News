"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

const mockAuthor = {
  name: "Jane Smith",
  avatar: "https://i.pravatar.cc/100?img=47",
};

const mockRelatedArticles = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    image: "https://source.unsplash.com/random/800x600?ai,healthcare",
  },
  {
    id: 2,
    title: "Ethical Considerations in Machine Learning",
    image: "https://source.unsplash.com/random/800x600?technology,ethics",
  },
  {
    id: 3,
    title: "How AI is Transforming Education",
    image: "https://source.unsplash.com/random/800x600?education,technology",
  },
];

export default function Component() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/getNewsArticle?id=${id}`);
        setArticle(response.data.article);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${id}`);
        setComments(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/comments/${id}`, {
        user: session?.user,
        content: comment,
      });

      const newComment = response.data.data; 
      setComments((prevComments) => [...prevComments, newComment]);
      setComment(""); 
    } catch (err) {
      console.error(err.message);
    }
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookShareUrl, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(twitterShareUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedInShareUrl, '_blank');
  };

  if (loading) return <p className="text-center py-8">Loading article...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  if (!article) return <p className="text-center py-8">Article not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

        <Image
          src={article.image_url}
          alt="Article featured image"
          width={800}
          height={400}
          className="w-full h-auto rounded-lg mb-6"
        />

        <div className="prose max-w-none mb-8 dark:prose-invert">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-4">
            <Button variant="outline" size="icon" onClick={shareToFacebook}>
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button variant="outline" size="icon" onClick={shareToTwitter}>
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="outline" size="icon" onClick={shareToLinkedIn}>
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </div>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRelatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id}>
                <CardHeader className="p-0">
                  <Image
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    width={400}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{relatedArticle.title}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-2"
            />
            <Button type="submit">
              <MessageCircle className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
          {comments.map((comment) => (
            <Card key={comment._id} className="mb-4">
              <CardHeader>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {comment.user.image ? (
                      <Image src={comment.user.image} alt={comment.user.name} layout="fill" className="rounded-full" />
                    ) : (
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback> // Fallback to the first letter of the user's name
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold">{comment.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })},{' '}
                      {new Date(comment.createdAt).toLocaleTimeString('en-GB', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </article>
    </div>
  );
}
