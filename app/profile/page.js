'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useArticleInteractions from "@/hooks/useArticleInteractions"; 
import { ArticleCard } from "@/components/ArticleCard2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import axios from 'axios';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { articles, setArticles, handleLike, handleDislike, handleBookmark } = useArticleInteractions();

    useEffect(() => {
        const fetchArticles = async () => {
            if (!session) return; 
            try {
                setLoading(true);
                const userId = session.user.id; 
                console.log('Fetching articles for user:', userId);

                const [bookmarksResponse, interactionsResponse] = await Promise.all([
                    axios.get(`/api/getBookmarkedNews?userId=${userId}`),
                    axios.get(`/api/getUserInteraction?userId=${userId}`)
                ]);

                console.log('Bookmarks API Response:', bookmarksResponse.data);
                console.log('Interactions API Response:', interactionsResponse.data);

                const fetchedArticles = bookmarksResponse.data || [];
                const interactionsData = interactionsResponse.data;

                if (fetchedArticles.length === 0) {
                    console.warn('No bookmarked articles found for the user');
                    setArticles([]);
                    return;
                }

                const interactionsMap = interactionsData.reduce((acc, interaction) => {
                    const { articleId, type } = interaction;
                    acc[articleId] = acc[articleId] || { liked: false, disliked: false, bookmarked: false };
                    acc[articleId][type] = true;
                    return acc;
                }, {});

                const updatedArticles = fetchedArticles.map(article => ({
                    ...article,
                    liked: interactionsMap[article._id]?.liked || false,
                    disliked: interactionsMap[article._id]?.disliked || false,
                    bookmarked: true, 
                }));

                console.log('Updated articles:', updatedArticles);

                setArticles(updatedArticles);
            } catch (err) {
                console.error('Error fetching articles:', err);
                setError(err.message || 'An error occurred while fetching articles');
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [session, setArticles]);

    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card>
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/api/auth/signin">Log In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                            <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                            <p className="text-sm text-muted-foreground">Email: {session.user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h1 className="text-3xl font-bold mb-6">Bookmarked Articles</h1>

            {loading ? (
                <p>Loading articles...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="space-y-6">
                    {console.log('Rendering articles:', articles)}
                    {articles && articles.length > 0 ? (
                        articles.map((article) => (
                            <ArticleCard
                                key={article._id}
                                article={article}
                                onLike={() => handleLike(article._id)}
                                onDislike={() => handleDislike(article._id)}
                                onBookmark={() => handleBookmark(article._id)}
                            />
                        ))
                    ) : (
                        <p>No articles bookmarked.</p>
                    )}
                </div>
            )}
        </div>
    );
}
