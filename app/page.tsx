"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetComparison } from "@/components/BudgetComparison";
import { SpendingInsights } from "@/components/SpendingInsights";
import { ExportData } from "@/components/ExportData";
import { Transaction, Budget, Category } from "@/lib/types";
import { IndianRupeeIcon, TrendingUpIcon, WalletIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, budgetsRes, categoriesRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets'),
        fetch('/api/categories')
      ]);

      if (!transactionsRes.ok || !budgetsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [transactionsData, budgetsData, categoriesData] = await Promise.all([
        transactionsRes.json(),
        budgetsRes.json(),
        categoriesRes.json()
      ]);

      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      await fetchData();
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      await fetchData();
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const editTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      await fetchData();
      toast.success('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const addBudget = async (budget: Budget) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        throw new Error('Failed to add budget');
      }

      await fetchData();
      toast.success('Budget set successfully');
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error('Failed to set budget');
    }
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const averageExpense = transactions.length > 0 
    ? totalExpenses / transactions.length 
    : 0;
  const lastMonthExpenses = transactions
    .filter(t => {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return t.date >= lastMonth && t.date < new Date(now.getFullYear(), now.getMonth(), 1);
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonth = transactions
    .filter(t => {
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return t.date >= firstOfMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthOverMonthChange = lastMonthExpenses > 0 
    ? ((thisMonth - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-blue-50/80 to-white dark:from-blue-950 dark:via-blue-950/80 dark:to-background">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 animate-gradient">
                Finance Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track, analyze, and optimize your financial journey
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="hidden sm:block">
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-100 dark:border-blue-900 backdrop-blur-sm hover:from-blue-500/20 transition-all duration-300">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Current Month vs Last Month</p>
                  <div className="flex items-center gap-2 mt-1">
                    {monthOverMonthChange > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-red-500 animate-bounce" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-green-500 animate-bounce" />
                    )}
                    <span className={`text-sm font-bold ${monthOverMonthChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(monthOverMonthChange).toFixed(1)}%
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-100 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">₹{totalExpenses.toFixed(2)}</h3>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <IndianRupeeIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-100 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Expense</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">₹{averageExpense.toFixed(2)}</h3>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <TrendingUpIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-100 dark:border-blue-900 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Month</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">₹{lastMonthExpenses.toFixed(2)}</h3>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <WalletIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Add Transaction</h2>
            <TransactionForm onSubmit={addTransaction} />
          </Card>

          <Card className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Set Budget</h2>
            <BudgetForm onSubmit={addBudget} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm overflow-hidden">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Monthly Expenses</h2>
            <div className="h-[250px] md:h-[300px]">
              <MonthlyExpensesChart transactions={transactions} />
            </div>
          </Card>

          <Card className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm overflow-hidden">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Category Distribution</h2>
            <div className="h-[250px] md:h-[300px]">
              <CategoryPieChart transactions={transactions} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <BudgetComparison transactions={transactions} budgets={budgets} />
          <SpendingInsights transactions={transactions} budgets={budgets} />
        </div>

        <Card className="p-4 md:p-6 border-blue-100 dark:border-blue-900 shadow-md bg-white/50 dark:bg-blue-950/50 backdrop-blur-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold">Transaction History</h2>
            <ExportData transactions={transactions} categories={categories} />
          </div>
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
          />
        </Card>
      </div>
    </main>
  );
}