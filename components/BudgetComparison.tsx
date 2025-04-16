"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transaction, Budget, Category } from "@/lib/types";

interface BudgetComparisonProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetComparison({ transactions, budgets }: BudgetComparisonProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const currentDate = new Date();
      const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth.getMonth() &&
               transactionDate.getFullYear() === currentMonth.getFullYear();
      });

      const data = categories.map(category => {
        const budget = budgets.find(b => 
          b.categoryId === category.id && 
          new Date(b.month).getMonth() === currentMonth.getMonth() &&
          new Date(b.month).getFullYear() === currentMonth.getFullYear()
        );

        const actual = monthlyTransactions
          .filter(t => t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          name: category.name,
          Budget: budget?.amount || 0,
          Actual: actual,
          Remaining: Math.max(0, (budget?.amount || 0) - actual),
        };
      });

      setChartData(data);
    }
  }, [categories, transactions, budgets]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Budget vs Actual</h2>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Budget vs Actual</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Budget" fill="#93c5fd" />
            <Bar dataKey="Actual" fill="#f87171" />
            <Bar dataKey="Remaining" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 