import mongoose from "mongoose";
import Interaction from "@/models/Interaction";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';

export async function POST(req) {
  try {
    await connectToMongoDB();

    const { articleId, userId } = await req.json();

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    let bookmark = await Interaction.findOne({
      articleId,
      userId,
      type: "bookmark",
    });

    if (bookmark) {
      await Interaction.deleteOne({ _id: bookmark._id });
      return NextResponse.json(
        { message: "Bookmark removed successfully" },
        { status: 200 }
      );
    } else {
      await Interaction.create({
        articleId,
        userId,
        type: "bookmark",
      });
      return NextResponse.json(
        { message: "Article bookmarked successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Error updating bookmark" },
      { status: 500 }
    );
  }
}
