import mongoose from "mongoose";
import NewsArticle from "@/models/NewsArticles";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';

export async function GET(req) {
  try {
    await connectToMongoDB();

    const id = req.nextUrl.searchParams.get("id");
    const article = await NewsArticle.findById(id).lean();

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Article fetched successfully",
        article: article,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      {
        error: "Error fetching article",
      },
      { status: 500 }
    );
  }
}
