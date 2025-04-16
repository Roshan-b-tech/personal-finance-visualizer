"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction, Category } from "@/lib/types";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieLabelProps {
  name: string;
  percent: number;
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

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
      const categoryTotals = transactions.reduce((acc, transaction) => {
        const category = categories.find(c => c.id === transaction.categoryId);
        if (category) {
          acc[category.name] = (acc[category.name] || 0) + transaction.amount;
        }
        return acc;
      }, {} as Record<string, number>);

      const data = Object.entries(categoryTotals).map(([name, value]) => {
        const category = categories.find(c => c.name === name);
        return {
          name,
          value,
          color: category?.color || '#000000',
        };
      });

      setChartData(data);
    }
  }, [transactions, categories]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: PieLabelProps) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `₹${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 