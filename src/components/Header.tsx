import React from 'react';
import { Settings, Database, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenCart: () => void;
  cartCount: number;
  totalPrice: number;
  isSupabaseActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenCart,
  cartCount,
  totalPrice,
  isSupabaseActive
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-12 h-12 rounded-20 bg-gradient-to-tr from-[#111827] to-[#1F2937] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl filter drop-shadow-sm select-none">🍏</span>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-apple-500 border-2 border-white"></span>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F172A]">
                  Под яблоком Ньютона
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-apple-100 text-apple-800 border border-apple-300/60">
                  НГТУ • NETI
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span className="hover:text-apple-600 transition-colors">F = G·(m₁m₂)/r²</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">g = 9.81 м/с²</span>
                <span className="hidden md:inline text-gray-300">•</span>
                <span className="hidden md:inline text-gray-400">Корпус 1</span>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Supabase Status Pill */}
            <div 
              title={isSupabaseActive ? "Подключена база данных Supabase" : "Работает на быстром локальном массиве"}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSupabaseActive 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseActive ? 'Supabase DB' : 'Локальный кэш'}</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors active:scale-95"
              title="Настройки API Gemini & Supabase"
              aria-label="Настройки"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-20 bg-[#0F172A] text-white hover:bg-black font-medium text-sm transition-all shadow-sm active:scale-95 group"
            >
              <ShoppingBag className="w-4 h-4 text-apple-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Поднос</span>
              {cartCount > 0 ? (
                <>
                  <span className="bg-apple-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                  <span className="font-bold text-apple-300 hidden md:inline ml-1">
                    {totalPrice} ₽
                  </span>
                </>
              ) : (
                <span className="text-gray-400 text-xs hidden sm:inline">0</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
