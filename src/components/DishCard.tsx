import React from 'react';
import { Info, Plus, Minus, Flame } from 'lucide-react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  cartQuantity: number;
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (dishId: number) => void;
  onOpenDetails: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
}) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-24 bg-[#F5F5F7] hover:bg-white border border-gray-100/60 hover:border-gray-200/80 transition-all duration-300 hover:shadow-card-hover overflow-hidden">
      
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Calories Badge over Photo */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold shadow-xs">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
          <span>{dish.calories} ккал</span>
        </div>

        {/* Info button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(dish);
          }}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 rounded-full bg-white/85 hover:bg-white text-gray-700 hover:text-black shadow-sm backdrop-blur-md transition-all active:scale-95"
          title="Подробный состав и КБЖУ"
          aria-label="Подробный состав"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Category tag */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-gray-800 shadow-2xs">
          {dish.category}
        </div>

        {/* Weight tag */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] sm:text-[11px] font-medium text-white/95">
          {dish.weight} {dish.category === 'Выпечка и напитки' && dish.weight > 200 ? 'мл/г' : 'г'}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        
        {/* Title & Ingredients */}
        <div 
          onClick={() => onOpenDetails(dish)}
          className="cursor-pointer"
        >
          <h3 className="font-bold text-sm sm:text-base text-[#0F172A] leading-snug group-hover:text-black transition-colors line-clamp-2">
            {dish.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed">
            {dish.ingredients}
          </p>
        </div>

        {/* Macros Pills: P, F, C */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/50 font-semibold" title="Белки">
            Б {dish.proteins}г
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/50 font-semibold" title="Жиры">
            Ж {dish.fats}г
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/50 font-semibold" title="Углеводы">
            У {dish.carbs}г
          </span>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {dish.price} ₽
            </span>
          </div>

          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(dish)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-apple-500 text-gray-900 hover:text-black font-semibold text-xs border border-gray-200 hover:border-apple-400 shadow-2xs hover:shadow-apple-sm transition-all duration-200 active:scale-95 group/btn"
            >
              <Plus className="w-3.5 h-3.5 group-hover/btn:scale-125 transition-transform" />
              <span>На поднос</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-black text-white p-1 rounded-full shadow-xs">
              <button
                onClick={() => onRemoveFromCart(dish.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition-colors"
                title="Уменьшить"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs px-1 text-apple-400 min-w-[16px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() => onAddToCart(dish)}
                className="w-7 h-7 rounded-full bg-apple-500 text-black flex items-center justify-center hover:bg-apple-400 active:scale-90 transition-colors"
                title="Увеличить"
              >
                <Plus className="w-3.5 h-3.5 font-bold" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
