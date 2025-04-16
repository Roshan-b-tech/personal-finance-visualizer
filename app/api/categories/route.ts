import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Category } from '@/lib/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const categories = await db.collection("categories").find({}).toArray();
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const category: Category = await request.json();
    
    const result = await db.collection("categories").insertOne({
      ...category,
      id: crypto.randomUUID(),
    });
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 