export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: Date;
}