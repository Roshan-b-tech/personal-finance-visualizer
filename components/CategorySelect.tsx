"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShoppingBasket, 
  CarFront, 
  Tv, 
  Home, 
  UtensilsCrossed, 
  ShoppingBag, 
  Stethoscope, 
  GraduationCap 
} from "lucide-react";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CategorySelect({ value, onValueChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-basket':
        return <ShoppingBasket className="h-4 w-4" />;
      case 'car-front':
        return <CarFront className="h-4 w-4" />;
      case 'tv':
        return <Tv className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'utensils-crossed':
        return <UtensilsCrossed className="h-4 w-4" />;
      case 'shopping-bag':
        return <ShoppingBag className="h-4 w-4" />;
      case 'stethoscope':
        return <Stethoscope className="h-4 w-4" />;
      case 'graduation-cap':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              {getIcon(category.icon)}
              {category.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 