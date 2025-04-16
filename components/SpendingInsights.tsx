"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, Budget, Category } from "@/lib/types";
import { AlertTriangle, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function SpendingInsights({ transactions, budgets }: { transactions: Transaction[], budgets: Budget[] }) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Calculate current month's spending by category
  const currentMonthSpending = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  // Calculate last month's spending by category
  const lastMonthSpending = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  // Generate insights
  const insights = useMemo(() => {
    const result = [];
    
    // Compare spending with budgets
    Object.entries(currentMonthSpending).forEach(([categoryId, amount]) => {
      const budget = budgets.find(b => b.categoryId === categoryId);
      const category = categories.find(c => c.id === categoryId);
      
      if (budget && category) {
        const percentage = (amount / budget.amount) * 100;
        
        if (percentage > 100) {
          result.push({
            type: 'warning',
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            title: 'Budget Alert',
            message: `You've exceeded your ${category.name} budget by ${(percentage - 100).toFixed(1)}%`,
            amount: amount - budget.amount
          });
        } else if (percentage > 80) {
          result.push({
            type: 'info',
            icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
            title: 'Budget Warning',
            message: `You're close to your ${category.name} budget limit (${percentage.toFixed(1)}%)`,
            amount: budget.amount - amount
          });
        }
      }
    });

    // Compare month-over-month changes
    Object.entries(currentMonthSpending).forEach(([categoryId, currentAmount]) => {
      const lastAmount = lastMonthSpending[categoryId] || 0;
      const category = categories.find(c => c.id === categoryId);
      
      if (category && lastAmount > 0) {
        const change = ((currentAmount - lastAmount) / lastAmount) * 100;
        
        if (Math.abs(change) > 20) {
          result.push({
            type: change > 0 ? 'increase' : 'decrease',
            icon: change > 0 ? 
              <ArrowUpRight className="h-5 w-5 text-red-500" /> : 
              <ArrowDownRight className="h-5 w-5 text-green-500" />,
            title: 'Spending Change',
            message: `${category.name} spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}%`,
            amount: Math.abs(currentAmount - lastAmount)
          });
        }
      }
    });

    // Find savings opportunities
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = Object.values(currentMonthSpending).reduce((sum, amount) => sum + amount, 0);
    
    if (totalSpent < totalBudget) {
      result.push({
        type: 'savings',
        icon: <PiggyBank className="h-5 w-5 text-green-500" />,
        title: 'Savings Opportunity',
        message: `You're under budget by ${((totalBudget - totalSpent) / totalBudget * 100).toFixed(1)}%`,
        amount: totalBudget - totalSpent
      });
    }

    return result;
  }, [currentMonthSpending, lastMonthSpending, budgets, categories]);

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

  if (insights.length === 0) {
    return (
      <Card className="p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-6">Spending Insights</h2>
        <div className="text-center text-muted-foreground py-8">
          No insights available at the moment. Add more transactions to see insights.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-6">Spending Insights</h2>
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50' :
              insight.type === 'info' ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50' :
              insight.type === 'increase' ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50' :
              insight.type === 'decrease' ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50' :
              'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {insight.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                <p className="text-sm font-medium mt-2">₹{insight.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 