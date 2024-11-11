import mongoose from "mongoose";
import NewsArticle from "@/models/NewsArticles";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';


export async function GET(req) {
  try {
    await connectToMongoDB();

    const category = req.nextUrl.searchParams.get("category");
    console.log("Requested category:", category);
    const articles = await NewsArticle.find({ category }).lean();

    return NextResponse.json(
      {
        message: "Articles fetched successfully",
        articles: articles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        error: "Error fetching articles",
      },
      { status: 500 }
    );
  }
}