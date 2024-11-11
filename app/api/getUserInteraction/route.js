import mongoose from "mongoose";
import Interaction from "@/models/Interaction";
import { NextResponse } from "next/server";
import connectToMongoDB from '@/lib/dbConnect';

export async function GET(req) {
  try {
    await connectToMongoDB();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const interactions = await Interaction.find({ userId }).lean();
    return NextResponse.json(interactions, { status: 200 });

  } catch (error) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json({ error: "Error fetching interactions" }, { status: 500 });
  }
}
