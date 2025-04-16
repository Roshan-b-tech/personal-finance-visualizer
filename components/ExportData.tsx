"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { Transaction, Category } from "@/lib/types";
import { toast } from "sonner";

interface ExportDataProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ExportData({ transactions, categories }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    try {
      setIsExporting(true);
      
      // Create CSV header
      const headers = ["Date", "Amount", "Description", "Category"];
      const csvContent = [headers];
      
      // Add transaction data
      transactions.forEach(transaction => {
        const category = categories.find(c => c.id === transaction.categoryId);
        const categoryName = category ? category.name : "Unknown";
        
        csvContent.push([
          new Date(transaction.date).toLocaleDateString(),
          transaction.amount.toFixed(2),
          transaction.description,
          categoryName
        ]);
      });
      
      // Convert to CSV string
      const csvString = csvContent.map(row => row.join(",")).join("\n");
      
      // Create and download file
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToCSV} 
      disabled={isExporting || transactions.length === 0}
      className="w-full sm:w-auto"
    >
      {isExporting ? (
        <>
          <Download className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Export Transactions
        </>
      )}
    </Button>
  );
} 