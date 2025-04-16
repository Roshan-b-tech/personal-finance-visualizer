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

// First, we need to create categories and get their IDs
const createCategories = async (db: any) => {
  const categoriesCollection = db.collection('categories');
  
  // Clear existing categories
  await categoriesCollection.deleteMany({});
  
  // Create new categories with IDs
  const categoryDocs = Object.entries(CATEGORIES).map(([key, name]) => ({
    name,
    color: getRandomColor(),
    icon: getRandomIcon()
  }));
  
  const result = await categoriesCollection.insertMany(categoryDocs);
  
  // Return a map of category names to their IDs
  const categoryMap: Record<string, string> = {};
  Object.keys(result.insertedIds).forEach((key, index) => {
    categoryMap[Object.values(CATEGORIES)[index]] = result.insertedIds[key].toString();
  });
  
  return categoryMap;
};

// Helper function to generate random colors
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to generate random icons
const getRandomIcon = () => {
  const icons = ['shopping-cart', 'utensils', 'car', 'home', 'book', 'heart', 'plane', 'gift'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// Sample transactions with category IDs (to be replaced with actual IDs)
const sampleTransactions: Omit<Transaction, 'id'>[] = [
  // Current month transactions
  {
    amount: 2500,
    description: 'Monthly groceries',
    date: new Date(),
    categoryId: 'FOOD_CATEGORY_ID', // This will be replaced with actual ID
  },
  {
    amount: 1500,
    description: 'Last week groceries',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    categoryId: 'FOOD_CATEGORY_ID',
  },
  {
    amount: 4000,
    description: 'Movie night',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    categoryId: 'ENTERTAINMENT_CATEGORY_ID',
  },
  {
    amount: 500,
    description: 'Bus fare',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    categoryId: 'TRANSPORTATION_CATEGORY_ID',
  },
  {
    amount: 2000,
    description: 'Electricity bill',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    categoryId: 'UTILITIES_CATEGORY_ID',
  },
  // Last month transactions (for comparison)
  {
    amount: 2000,
    description: 'Last month groceries',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryId: 'FOOD_CATEGORY_ID',
  },
  {
    amount: 600,
    description: 'Last month movie',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryId: 'ENTERTAINMENT_CATEGORY_ID',
  },
  {
    amount: 400,
    description: 'Last month bus fare',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryId: 'TRANSPORTATION_CATEGORY_ID',
  },
  {
    amount: 1800,
    description: 'Last month electricity',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryId: 'UTILITIES_CATEGORY_ID',
  },
  {
    amount: 1500,
    description: 'Last month course',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    categoryId: 'EDUCATION_CATEGORY_ID',
  },
];

// Sample budgets with category IDs (to be replaced with actual IDs)
const sampleBudgets: Omit<Budget, 'id'>[] = [
  {
    categoryId: 'FOOD_CATEGORY_ID',
    amount: 5000,
    month: new Date(),
  },
  {
    categoryId: 'ENTERTAINMENT_CATEGORY_ID',
    amount: 3000,
    month: new Date(),
  },
  {
    categoryId: 'TRANSPORTATION_CATEGORY_ID',
    amount: 1000,
    month: new Date(),
  },
  {
    categoryId: 'UTILITIES_CATEGORY_ID',
    amount: 2500,
    month: new Date(),
  },
  {
    categoryId: 'EDUCATION_CATEGORY_ID',
    amount: 1500,
    month: new Date(),
  },
];

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // First create categories and get their IDs
    const categoryMap = await createCategories(db);
    
    // Now update the sample transactions with actual category IDs
    const transactionsWithRealIds = sampleTransactions.map(transaction => ({
      ...transaction,
      categoryId: categoryMap[transaction.categoryId.split('_')[0]] || transaction.categoryId
    }));
    
    // Update the sample budgets with actual category IDs
    const budgetsWithRealIds = sampleBudgets.map(budget => ({
      ...budget,
      categoryId: categoryMap[budget.categoryId.split('_')[0]] || budget.categoryId
    }));
    
    // Clear existing data
    await db.collection('transactions').deleteMany({});
    await db.collection('budgets').deleteMany({});
    
    // Insert sample transactions
    if (transactionsWithRealIds.length > 0) {
      await db.collection('transactions').insertMany(transactionsWithRealIds);
    }
    
    // Insert sample budgets
    if (budgetsWithRealIds.length > 0) {
      await db.collection('budgets').insertMany(budgetsWithRealIds);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
} 