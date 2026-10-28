export type DishCategory = 'Супы' | 'Горячее' | 'Гарниры' | 'Салаты' | 'Выпечка и напитки';

export interface Dish {
  id: number;
  name: string;
  category: DishCategory;
  price: number;
  weight: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  ingredients: string;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface AIRecommendation {
  reasoning: string;
  selectedDishes: Dish[];
  totalPrice: number;
  totalCalories: number;
  totalProteins: number;
  totalFats: number;
  totalCarbs: number;
  source: 'gemini' | 'smart_fallback';
}

export interface AppSettings {
  geminiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}
