import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction, Category } from "@/lib/types";

interface CategoryDistributionChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function CategoryDistributionChart({
  transactions,
  categories,
}: CategoryDistributionChartProps) {
  const data = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    
    // Initialize all categories with 0
    categories.forEach(category => {
      categoryTotals.set(category.id, 0);
    });

    // Calculate totals for each category
    transactions.forEach(transaction => {
      const currentTotal = categoryTotals.get(transaction.categoryId) || 0;
      categoryTotals.set(transaction.categoryId, currentTotal + transaction.amount);
    });

    // Convert to array format for Recharts
    return categories.map(category => ({
      name: category.name,
      value: categoryTotals.get(category.id) || 0,
      color: category.color,
    })).filter(item => item.value > 0);
  }, [transactions, categories]);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `₹${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
            'Amount'
          ]}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => (
            <span className="text-sm font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 