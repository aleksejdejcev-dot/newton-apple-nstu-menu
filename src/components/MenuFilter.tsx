import React from 'react';
import { Search, Flame, Dumbbell } from 'lucide-react';
import { DishCategory } from '../types';

interface MenuFilterProps {
  categories: (DishCategory | 'Все')[];
  selectedCategory: DishCategory | 'Все';
  onSelectCategory: (category: DishCategory | 'Все') => void;
  highProteinOnly: boolean;
  onToggleHighProtein: () => void;
  under200KcalOnly: boolean;
  onToggleUnder200Kcal: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalFilteredCount: number;
}

export const MenuFilter: React.FC<MenuFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  highProteinOnly,
  onToggleHighProtein,
  under200KcalOnly,
  onToggleUnder200Kcal,
  searchQuery,
  onSearchChange,
  totalFilteredCount
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Scrollable category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по меню..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick toggle chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Фильтры:</span>
          
          {/* High protein toggle */}
          <button
            onClick={onToggleHighProtein}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
              highProteinOnly
                ? 'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-400/30'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Dumbbell className={`w-3.5 h-3.5 ${highProteinOnly ? 'text-purple-700' : 'text-gray-400'}`} />
            <span>Высокий белок (≥ 15г)</span>
          </button>

          {/* Under 200 kcal toggle */}
          <button
            onClick={onToggleUnder200Kcal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
              under200KcalOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${under200KcalOnly ? 'text-amber-700' : 'text-gray-400'}`} />
            <span>До 200 ккал</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 font-mono">
          Найдено позиций: <strong className="text-gray-900">{totalFilteredCount}</strong>
        </div>
      </div>
    </div>
  );
};
