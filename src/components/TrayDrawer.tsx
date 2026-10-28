import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Flame, Share2, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';

interface TrayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onAddToCart: (dish: CartItem['dish']) => void;
  onRemoveFromCart: (dishId: number) => void;
  onClearCart: () => void;
}

export const TrayDrawer: React.FC<TrayDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}) => {
  const [copied, setCopied] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalCalories = items.reduce((sum, item) => sum + item.dish.calories * item.quantity, 0);
  const totalProteins = items.reduce((sum, item) => sum + item.dish.proteins * item.quantity, 0);
  const totalFats = items.reduce((sum, item) => sum + item.dish.fats * item.quantity, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.dish.carbs * item.quantity, 0);

  const totalMacros = (totalProteins * 4) + (totalFats * 9) + (totalCarbs * 4);
  const pPct = totalMacros > 0 ? Math.round(((totalProteins * 4) / totalMacros) * 100) : 33;
  const fPct = totalMacros > 0 ? Math.round(((totalFats * 9) / totalMacros) * 100) : 33;
  const cPct = totalMacros > 0 ? Math.max(0, 100 - pPct - fPct) : 34;

  const handleCopySummary = () => {
    if (items.length === 0) return;
    const lines = [
      '🍏 Мой обед в столовой «Под яблоком Ньютона» (НГТУ):',
      ...items.map(i => `• ${i.dish.name} x${i.quantity} — ${i.dish.price * i.quantity} ₽ (${i.dish.calories * i.quantity} ккал)`),
      `\nИтого: ${totalPrice} ₽ | ${totalCalories} ккал`,
      `БЖУ: Б: ${totalProteins.toFixed(1)}г | Ж: ${totalFats.toFixed(1)}г | У: ${totalCarbs.toFixed(1)}г`,
      '#НГТУ #ПодЯблокомНьютона #СтуденческийОбед'
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setOrdered(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setOrdered(false);
      onClearCart();
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center text-apple-400">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Мой студенческий поднос</h2>
                <p className="text-[11px] sm:text-xs text-gray-400 font-mono">
                  {totalItems} {totalItems === 1 ? 'позиция' : totalItems > 1 && totalItems < 5 ? 'позиции' : 'позиций'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Очистить поднос"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center text-3xl mb-3">
                  🍽️
                </div>
                <h3 className="font-bold text-gray-700 text-base mb-1">Поднос пуст</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Выберите вкусные блюда в меню или доверьтесь «Ньютон AI» для подбора идеального обеда.
                </p>
              </div>
            ) : (
              items.map(({ dish, quantity }) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 p-3 rounded-20 bg-[#F5F5F7] border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-16 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {dish.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                      <span className="font-semibold text-gray-900">{dish.price * quantity} ₽</span>
                      <span>•</span>
                      <span>{dish.calories * quantity} ккал</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Б: {(dish.proteins * quantity).toFixed(1)}г • Ж: {(dish.fats * quantity).toFixed(1)}г • У: {(dish.carbs * quantity).toFixed(1)}г
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-full shadow-2xs">
                    <button
                      onClick={() => onRemoveFromCart(dish.id)}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 active:scale-90 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs px-1 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onAddToCart(dish)}
                      className="w-6 h-6 rounded-full bg-apple-500 hover:bg-apple-400 text-black flex items-center justify-center font-bold active:scale-90 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 space-y-3.5 flex-shrink-0">
              
              {/* Macro Progress Bar */}
              <div className="bg-white p-3 sm:p-3.5 rounded-24 border border-gray-200/80 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-700">Баланс нутриентов обеда:</span>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="font-bold">{totalCalories} ккал</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-gray-100 flex overflow-hidden mb-2">
                  <div style={{ width: `${pPct}%` }} className="bg-purple-500" title={`Белки: ${pPct}%`} />
                  <div style={{ width: `${fPct}%` }} className="bg-amber-400" title={`Жиры: ${fPct}%`} />
                  <div style={{ width: `${cPct}%` }} className="bg-blue-400" title={`Углеводы: ${cPct}%`} />
                </div>

                <div className="flex justify-between text-[10px] sm:text-[11px] font-mono text-gray-600 pt-1">
                  <span>Б: <strong className="text-purple-700">{totalProteins.toFixed(1)}г</strong> ({pPct}%)</span>
                  <span>Ж: <strong className="text-amber-700">{totalFats.toFixed(1)}г</strong> ({fPct}%)</span>
                  <span>У: <strong className="text-blue-700">{totalCarbs.toFixed(1)}г</strong> ({cPct}%)</span>
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs sm:text-sm font-semibold text-gray-500">К оплате:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{totalPrice} ₽</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleCopySummary}
                  className="py-3 px-3 rounded-full bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs border border-gray-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gray-500" />
                      <span>Поделиться</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCheckout}
                  disabled={ordered}
                  className="py-3 px-4 rounded-full bg-apple-500 hover:bg-apple-400 text-black font-bold text-xs shadow-apple-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  {ordered ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-black" />
                      <span>Приятного аппетита!</span>
                    </>
                  ) : (
                    <>
                      <span>Заказать поднос</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
