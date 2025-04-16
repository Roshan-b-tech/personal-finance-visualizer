"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, Budget, Category } from "@/lib/types";
import { WalletIcon, TrendingUpIcon, PiggyBankIcon } from "lucide-react";

export function FinancialInsights({ transactions, budgets }: { transactions: Transaction[], budgets: Budget[] }) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Calculate current month's total spending
  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Calculate month-over-month change
  const percentChange = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthTotal = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (lastMonthTotal === 0) return 0;
    return ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  }, [transactions, currentMonthTotal]);

  // Find top spending category
  const topCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const categoryTotals = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const entries = Object.entries(categoryTotals);
    if (entries.length === 0) return { categoryId: '', amount: 0 };
    
    return entries.reduce((max, [categoryId, amount]) => 
      amount > max.amount ? { categoryId, amount } : max,
      { categoryId: entries[0][0], amount: entries[0][1] }
    );
  }, [transactions]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card className="p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-6">Financial Insights</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <WalletIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Spending</p>
              <h3 className="text-2xl font-bold">${currentMonthTotal.toFixed(2)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Month-over-Month Change</p>
              <h3 className={`text-2xl font-bold ${percentChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PiggyBankIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Spending Category</p>
              <h3 className="text-2xl font-bold">${topCategory.amount.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground">
                {categories.find(c => c.id === topCategory.categoryId)?.name || 'Unknown Category'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
} 