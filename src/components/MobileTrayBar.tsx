import React from 'react';
import { ShoppingBag, ChevronUp, Flame } from 'lucide-react';
import { CartItem } from '../types';

interface MobileTrayBarProps {
  items: CartItem[];
  onOpenTray: () => void;
}

export const MobileTrayBar: React.FC<MobileTrayBarProps> = ({ items, onOpenTray }) => {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCount === 0) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalCalories = items.reduce((sum, item) => sum + item.dish.calories * item.quantity, 0);

  return (
    <div className="fixed bottom-3 inset-x-3 z-30 md:hidden animate-slideUp">
      <div 
        onClick={onOpenTray}
        className="flex items-center justify-between p-3 bg-[#0F172A] text-white rounded-full shadow-2xl border border-white/10 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="flex items-center gap-3 pl-1">
          <div className="relative w-10 h-10 rounded-full bg-apple-500 text-black flex items-center justify-center font-black flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center border border-apple-400">
              {totalCount}
            </span>
          </div>

          <div>
            <div className="text-sm font-extrabold text-white leading-tight">
              {totalPrice} ₽
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{totalCalories} ккал</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="text-xs font-bold text-apple-400">Поднос</span>
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronUp className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
