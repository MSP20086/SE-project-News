import mongoose from "mongoose";
import Interaction from "@/models/Interaction";
import NewsArticle from "@/models/NewsArticles"; 
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';


export async function GET(req) {
  try {
    await connectToMongoDB();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const interactions = await Interaction.find({ userId, type: "bookmark" }).lean();

    const newsArticleIds = interactions.map(interaction => interaction.articleId);

    const newsArticles = await NewsArticle.find({ _id: { $in: newsArticleIds } }).lean();

    return NextResponse.json(newsArticles, { status: 200 });
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return NextResponse.json({ error: "Error fetching news articles" }, { status: 500 });
  }
}
