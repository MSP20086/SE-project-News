import axios from "axios";
import mongoose from "mongoose";
import NewsArticle from "@/models/NewsArticles";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';

export async function POST() {
    try {
        console.log("Fetching and storing news articles");

        await connectToMongoDB();
        const response = await axios.get("http://localhost:5000/scrape");
        console.log("Fetched articles:", response.data);

        const articles = response.data;

        if (Array.isArray(articles) && articles.length > 0) {
            const newArticles = [];

            for (const article of articles) {
                const existingArticle = await NewsArticle.findOne({ title: article.title });

                if (!existingArticle) {
                    newArticles.push(article);
                } else {
                    console.log(`Article with title "${article.title}" already exists.`);
                }
            }

            if (newArticles.length > 0) {
                await NewsArticle.insertMany(newArticles);
                console.log(`${newArticles.length} new articles have been stored in MongoDB`);
            } else {
                console.log("No new articles to store.");
            }
        }

        return NextResponse.json({
            message: "Articles fetched and stored successfully",
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: e.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
