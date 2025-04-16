import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Category } from '@/lib/types';

const initialCategories: Omit<Category, 'id'>[] = [
  {
    name: 'Groceries',
    color: '#FF6B6B',
    icon: 'shopping-basket'
  },
  {
    name: 'Transportation',
    color: '#4ECDC4',
    icon: 'car-front'
  },
  {
    name: 'Entertainment',
    color: '#45B7D1',
    icon: 'tv'
  },
  {
    name: 'Utilities',
    color: '#96CEB4',
    icon: 'home'
  },
  {
    name: 'Dining Out',
    color: '#FFEEAD',
    icon: 'utensils-crossed'
  },
  {
    name: 'Shopping',
    color: '#D4A5A5',
    icon: 'shopping-bag'
  },
  {
    name: 'Healthcare',
    color: '#9B6B6C',
    icon: 'stethoscope'
  },
  {
    name: 'Education',
    color: '#92A8D1',
    icon: 'graduation-cap'
  }
];

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    
    // Clear existing categories
    await db.collection("categories").deleteMany({});
    
    // Insert new categories with IDs
    const categoriesWithIds = initialCategories.map(category => ({
      ...category,
      id: crypto.randomUUID()
    }));
    
    await db.collection("categories").insertMany(categoriesWithIds);
    
    return NextResponse.json({ message: 'Categories seeded successfully' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to seed categories' }, { status: 500 });
  }
} 