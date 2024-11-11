import mongoose from "mongoose";
import Interaction from "@/models/Interaction";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';

export async function POST(req) {
  try {
    await connectToMongoDB();

    const { articleId, userId, action } = await req.json();

    if (!articleId || !userId || !['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    let interaction = await Interaction.findOne({ articleId, userId });

    if (interaction) {
      if (interaction.type === action) {
        await Interaction.deleteOne({ _id: interaction._id });
      } else {
        interaction.type = action;
        await interaction.save();
      }
    } else {
      interaction = await Interaction.create({
        articleId,
        userId,
        type: action,
      });
    }
    const likesCount = await Interaction.countDocuments({
      articleId,
      type: "like",
    });
    const dislikesCount = await Interaction.countDocuments({
      articleId,
      type: "dislike",
    });

    return NextResponse.json(
      {
        message: `${action} updated successfully`,
        likesCount,
        dislikesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating likes/dislikes:", error);
    return NextResponse.json(
      { error: "Error updating likes/dislikes" },
      { status: 500 }
    );
  }
}
