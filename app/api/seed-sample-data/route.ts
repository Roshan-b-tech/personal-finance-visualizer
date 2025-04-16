import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Transaction, Budget } from '@/lib/types';

// Define categories explicitly to ensure consistency
const CATEGORIES = {
  FOOD: 'Food',
  ENTERTAINMENT: 'Entertainment',
  TRANSPORTATION: 'Transportation',
  UTILITIES: 'Utilities',
  EDUCATION: 'Education',
  SHOPPING: 'Shopping',
  HEALTH: 'Health',
  TRAVEL: 'Travel',
  OTHER: 'Other'
};

const sampleTransactions: Omit<Transaction, 'id'>[] = [
  // Current month transactions
  {
    amount: 2500,
    description: 'Monthly groceries',
    date: new Date(),
    categoryName: CATEGORIES.FOOD, // Use category name instead of ID
  },
  {
    amount: 1500,
    description: 'Last week groceries',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    categoryName: CATEGORIES.FOOD,
  },
  {
    amount: 4000,
    description: 'Movie night',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    categoryName: CATEGORIES.ENTERTAINMENT,
  },
  {
    amount: 500,
    description: 'Bus fare',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    categoryName: CATEGORIES.TRANSPORTATION,
  },
  {
    amount: 2000,
    description: 'Electricity bill',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    categoryName: CATEGORIES.UTILITIES,
  },
  {
    amount: 2000,
    description: 'Online course',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    categoryName: CATEGORIES.EDUCATION,
  },
  // Last month transactions (for comparison)
  {
    amount: 2000,
    description: 'Last month groceries',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryName: CATEGORIES.FOOD,
  },
  {
    amount: 600,
    description: 'Last month movie',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryName: CATEGORIES.ENTERTAINMENT,
  },
  {
    amount: 400,
    description: 'Last month bus fare',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryName: CATEGORIES.TRANSPORTATION,
  },
  {
    amount: 1800,
    description: 'Last month electricity',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryName: CATEGORIES.UTILITIES,
  },
  {
    amount: 1500,
    description: 'Last month course',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryName: CATEGORIES.EDUCATION,
  },
];

const sampleBudgets: Omit<Budget, 'id'>[] = [
  {
    amount: 4000, // Budget for Food
    categoryName: CATEGORIES.FOOD,
    month: new Date(),
  },
  {
    amount: 3000, // Budget for Entertainment (lower than current spending to trigger warning)
    categoryName: CATEGORIES.ENTERTAINMENT,
    month: new Date(),
  },
  {
    amount: 1000, // Budget for Transportation
    categoryName: CATEGORIES.TRANSPORTATION,
    month: new Date(),
  },
  {
    amount: 2500, // Budget for Utilities
    categoryName: CATEGORIES.UTILITIES,
    month: new Date(),
  },
  {
    amount: 1500, // Budget for Education (lower than current spending to trigger warning)
    categoryName: CATEGORIES.EDUCATION,
    month: new Date(),
  },
];

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    
    // Get categories
    const categories = await db.collection("categories").find({}).toArray();
    
    if (categories.length === 0) {
      return NextResponse.json({ error: 'No categories found. Please seed categories first.' }, { status: 400 });
    }

    // Clear existing transactions and budgets
    await db.collection("transactions").deleteMany({});
    await db.collection("budgets").deleteMany({});
    
    // Create a map of category names to IDs
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category.name, category.id);
    });
    
    // Assign category IDs to transactions
    const transactionsWithIds = sampleTransactions.map(transaction => {
      const categoryId = categoryMap.get(transaction.categoryName);
      if (!categoryId) {
        console.warn(`Category not found: ${transaction.categoryName}`);
      }
      
      return {
        ...transaction,
        id: crypto.randomUUID(),
        categoryId: categoryId || categories[0].id, // Fallback to first category if not found
      };
    });
    
    // Assign category IDs to budgets
    const budgetsWithIds = sampleBudgets.map(budget => {
      const categoryId = categoryMap.get(budget.categoryName);
      if (!categoryId) {
        console.warn(`Category not found: ${budget.categoryName}`);
      }
      
      return {
        ...budget,
        id: crypto.randomUUID(),
        categoryId: categoryId || categories[0].id, // Fallback to first category if not found
      };
    });
    
    // Insert sample data
    await db.collection("transactions").insertMany(transactionsWithIds);
    await db.collection("budgets").insertMany(budgetsWithIds);
    
    return NextResponse.json({ message: 'Sample data seeded successfully' });
  } catch (e) {
    console.error('Error seeding sample data:', e);
    return NextResponse.json({ error: 'Failed to seed sample data' }, { status: 500 });
  }
} 