import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/lib/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transactions = await db.collection("transactions").find({}).toArray();
    return NextResponse.json(transactions);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transaction: Transaction = await request.json();
    
    const result = await db.collection("transactions").insertOne({
      ...transaction,
      id: crypto.randomUUID(),
    });
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transaction: Transaction = await request.json();
    
    const result = await db.collection("transactions").updateOne(
      { id: transaction.id },
      { $set: transaction }
    );
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("finance");
    
    const result = await db.collection("transactions").deleteOne({ id });
    
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 