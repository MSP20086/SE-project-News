import dbConnect from '@/lib/dbConnect';
import Article from '@/models/NewsArticles';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  await dbConnect();

  try {
    const articles = await Article.find({
      title: { $regex: query, $options: 'i' } 
    }).lean(); 

    return NextResponse.json({
      message: 'Articles fetched successfully',
      data: articles,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Error fetching articles',
    }, { status: 500 });
  }
}
