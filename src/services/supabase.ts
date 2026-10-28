import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Dish } from '../types';
import { INITIAL_DISHES } from '../data/dishes';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('newton_supabase_url');
  const localKey = localStorage.getItem('newton_supabase_anon_key');
  
  const url = localUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  return { url: url.trim(), key: key.trim() };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url) localStorage.setItem('newton_supabase_url', url.trim());
  else localStorage.removeItem('newton_supabase_url');
  
  if (key) localStorage.setItem('newton_supabase_anon_key', key.trim());
  else localStorage.removeItem('newton_supabase_anon_key');

  supabaseInstance = null; // Reset cached client
};

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
};

export const isSupabaseConnected = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
};

export async function fetchDishes(): Promise<{ dishes: Dish[]; source: 'supabase' | 'local'; error?: string }> {
  const client = getSupabaseClient();
  
  if (!client) {
    return { dishes: INITIAL_DISHES, source: 'local' };
  }

  try {
    const { data, error } = await client
      .from('dishes')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch failed or empty, using local dishes:', error?.message);
      return { 
        dishes: INITIAL_DISHES, 
        source: 'local', 
        error: error?.message || 'База пуста, загружены локальные блюда' 
      };
    }

    // Map column names if snake_cased or camelCased
    const mapped: Dish[] = data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      category: item.category,
      price: Number(item.price),
      weight: Number(item.weight),
      calories: Number(item.calories),
      proteins: Number(item.proteins),
      fats: Number(item.fats),
      carbs: Number(item.carbs),
      ingredients: item.ingredients || '',
      image: item.image || item.image_url || '',
      inStock: item.inStock !== undefined ? Boolean(item.inStock) : (item.in_stock !== undefined ? Boolean(item.in_stock) : true)
    }));

    return { dishes: mapped, source: 'supabase' };
  } catch (err: any) {
    console.error('Supabase query exception, falling back:', err);
    return { 
      dishes: INITIAL_DISHES, 
      source: 'local', 
      error: err?.message || 'Ошибка сети' 
    };
  }
}
