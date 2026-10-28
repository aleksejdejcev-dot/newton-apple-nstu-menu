import React from 'react';
import { X, Flame, Plus, Minus, Scale } from 'lucide-react';
import { Dish } from '../types';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (dishId: number) => void;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
}) => {
  if (!dish) return null;

  // Calculate percentages for macro bar
  const totalMacros = (dish.proteins * 4) + (dish.fats * 9) + (dish.carbs * 4);
  const pPct = totalMacros > 0 ? Math.round(((dish.proteins * 4) / totalMacros) * 100) : 33;
  const fPct = totalMacros > 0 ? Math.round(((dish.fats * 9) / totalMacros) * 100) : 33;
  const cPct = totalMacros > 0 ? Math.max(0, 100 - pPct - fPct) : 34;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-28 bg-white shadow-2xl border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black text-white backdrop-blur-md transition-colors active:scale-95"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-[16/10] w-full bg-gray-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="px-3 py-1 rounded-full bg-apple-500 text-black text-xs font-bold shadow-sm">
              {dish.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>{dish.weight} {dish.category === 'Выпечка и напитки' && dish.weight > 200 ? 'мл/г' : 'г'}</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Title & Calories */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                {dish.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                ID: neti-canteen-{dish.id} • Свежее приготовление
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-20 bg-amber-50 text-amber-900 border border-amber-200 text-sm font-bold flex-shrink-0">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{dish.calories} ккал</span>
            </div>
          </div>

          {/* Detailed Ingredients */}
          <div className="bg-[#F5F5F7] p-4 rounded-20 border border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Подробный состав
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">
              {dish.ingredients}
            </p>
          </div>

          {/* Macro Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Макронутриенты (БЖУ)
              </h4>
              <span className="text-xs text-gray-400 font-mono">
                Энергия: {dish.calories} ккал
              </span>
            </div>

            {/* Visual ratio bar */}
            <div className="h-2.5 w-full rounded-full bg-gray-200 flex overflow-hidden mb-3">
              <div style={{ width: `${pPct}%` }} className="bg-purple-500" title={`Белки: ${pPct}%`} />
              <div style={{ width: `${fPct}%` }} className="bg-amber-400" title={`Жиры: ${fPct}%`} />
              <div style={{ width: `${cPct}%` }} className="bg-blue-400" title={`Углеводы: ${cPct}%`} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-16 bg-purple-50 border border-purple-100">
                <span className="text-[11px] font-semibold text-purple-700 block">Белки</span>
                <span className="text-base font-extrabold text-purple-900">{dish.proteins} г</span>
                <span className="text-[10px] text-purple-500 block">{pPct}% калорий</span>
              </div>
              <div className="p-2.5 rounded-16 bg-amber-50 border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700 block">Жиры</span>
                <span className="text-base font-extrabold text-amber-900">{dish.fats} г</span>
                <span className="text-[10px] text-amber-500 block">{fPct}% калорий</span>
              </div>
              <div className="p-2.5 rounded-16 bg-blue-50 border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-700 block">Углеводы</span>
                <span className="text-base font-extrabold text-blue-900">{dish.carbs} г</span>
                <span className="text-[10px] text-blue-500 block">{cPct}% калорий</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Price and Add Action */}
        <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-500 block">Стоимость порции:</span>
            <span className="text-2xl font-black text-[#0F172A]">{dish.price} ₽</span>
          </div>

          <div className="flex items-center gap-3">
            {cartQuantity > 0 && (
              <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-16 shadow-2xs">
                <button
                  onClick={() => onRemoveFromCart(dish.id)}
                  className="w-8 h-8 rounded-12 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm px-2">{cartQuantity}</span>
                <button
                  onClick={() => onAddToCart(dish)}
                  className="w-8 h-8 rounded-12 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => onAddToCart(dish)}
              className="px-6 py-3.5 rounded-20 bg-apple-500 hover:bg-apple-400 text-black font-bold text-sm shadow-apple-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{cartQuantity > 0 ? 'Добавить еще' : 'На поднос'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
