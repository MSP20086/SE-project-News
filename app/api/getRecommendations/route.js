import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    const flaskResponse = await axios.get(`http://localhost:5000/recommend`, {
      params: { user_id: userId },
    });

    if (flaskResponse.status !== 200) {
      throw new Error("Failed to fetch recommendations from Flask API");
    }

    const recommendedArticles = flaskResponse.data;

    return NextResponse.json(
      {
        message: "Articles fetched successfully",
        articles: recommendedArticles,
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
