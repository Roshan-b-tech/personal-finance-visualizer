"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Transaction } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const monthlyTotals = new Map<string, number>();
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    // Initialize all months with 0
    last6Months.forEach(month => monthlyTotals.set(month, 0));

    // Calculate totals for each month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyTotals.has(monthKey)) {
        monthlyTotals.set(monthKey, monthlyTotals.get(monthKey)! + transaction.amount);
      }
    });

    // Convert to array format for Recharts
    return last6Months.map(month => ({
      month,
      amount: monthlyTotals.get(month) || 0,
    }));
  }, [transactions]);

  const averageExpense = useMemo(() => {
    const total = monthlyData.reduce((sum, data) => sum + data.amount, 0);
    return total / monthlyData.length;
  }, [monthlyData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={monthlyData}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(value) => `₹${value.toLocaleString()}`}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          fill="#93c5fd"
          fillOpacity={0.3}
        />
        <ReferenceLine
          y={averageExpense}
          stroke="#ef4444"
          strokeDasharray="3 3"
          label={{
            value: `Avg: ₹${averageExpense.toLocaleString()}`,
            position: 'right',
            fill: '#ef4444',
            fontSize: 12,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}