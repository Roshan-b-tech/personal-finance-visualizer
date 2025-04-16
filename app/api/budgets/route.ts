import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/lib/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const budgets = await db.collection("budgets").find({}).toArray();
    return NextResponse.json(budgets);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const budget: Budget = await request.json();
    
    const result = await db.collection("budgets").insertOne({
      ...budget,
      id: crypto.randomUUID(),
    });
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const budget: Budget = await request.json();
    
    const result = await db.collection("budgets").updateOne(
      { id: budget.id },
      { $set: budget }
    );
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("finance");
    
    const result = await db.collection("budgets").deleteOne({ id });
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 