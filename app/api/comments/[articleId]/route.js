import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { articleId } = params;

  await dbConnect();

  try {
    const comments = await Comment.find({ articleId });
    return NextResponse.json({
      message: "Comments fetched successfully",
      data : comments
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching comments",
    } , { status: 500 });
  }
}

export async function POST(req, { params }) {
  const { articleId :articleId } = await params;
  const { user, content } = await req.json(); 

  await dbConnect();

  try {
    const comment = await Comment.create({
      articleId,
      user,
      content,
    });
    return NextResponse.json({
      message: "Comment successfully posted",
      data : comment
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Error posting comment",
    } , { status: 500 });
  }
}
