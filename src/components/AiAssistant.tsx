import React, { useState } from 'react';
import { Sparkles, Send, Flame, Zap, Apple, Dumbbell, Check, RefreshCw, Settings, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Dish, AIRecommendation } from '../types';
import { getAIMealRecommendation } from '../services/ai';

interface AiAssistantProps {
  dishes: Dish[];
  onAddComboToCart: (dishes: Dish[]) => void;
  onOpenSettings: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  dishes,
  onAddComboToCart,
  onOpenSettings
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const presets = [
    {
      label: '💪 Максимум белка до 300 ₽',
      text: 'Хочу максимум белка до 300 рублей для восстановления после тренировки',
      icon: Dumbbell,
      color: 'hover:border-purple-300 hover:bg-purple-50/50 text-purple-950',
    },
    {
      label: '🍏 Легкий обед до 450 ккал',
      text: 'Легкий и полезный обед до 450 ккал, чтобы не клонило в сон на лекциях',
      icon: Apple,
      color: 'hover:border-apple-300 hover:bg-apple-50/50 text-apple-950',
    },
    {
      label: '⚡ Сытный комбо для пар до 250 ₽',
      text: 'Сытный студенческий обед на весь учебный день в пределах 250 рублей',
      icon: Zap,
      color: 'hover:border-amber-300 hover:bg-amber-50/50 text-amber-950',
    },
  ];

  const handleGenerate = async (promptToUse?: string) => {
    const text = (promptToUse || query).trim();
    if (!text || loading) return;

    if (promptToUse) {
      setQuery(promptToUse);
    }

    setLoading(true);
    setAddedSuccess(false);

    try {
      const result = await getAIMealRecommendation(text, dishes);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCombo = () => {
    if (!recommendation) return;
    onAddComboToCart(recommendation.selectedDishes);
    setAddedSuccess(true);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#84CC16', '#A3E635', '#0F172A', '#10B981']
    });

    setTimeout(() => {
      setAddedSuccess(false);
    }, 2800);
  };

  return (
    <section className="relative overflow-hidden rounded-28 border border-apple-300/40 bg-gradient-to-br from-[#F4FBE8] via-white to-[#ECFDF5] p-4 sm:p-7 md:p-8 shadow-subtle mb-10 transition-all">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-apple-300/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

      {/* Header bar of the AI block */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-apple-400 flex items-center justify-center shadow-apple-sm flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-[#0F172A] leading-tight">
              ИИ-нутрициолог «Ньютон AI»
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Персональный расчет идеального студенческого рациона за 1 секунду
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* AI Core badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#0F172A] text-[11px] sm:text-xs font-mono font-semibold border border-black/10">
            <span className="w-2 h-2 rounded-full bg-apple-500 animate-pulse"></span>
            <span>AI Core: <strong className="text-apple-700">Gemini 3.8 Flash</strong></span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full text-gray-500 hover:text-black hover:bg-black/5 transition-colors"
            title="Настроить API ключ"
            aria-label="Настроить API ключ"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input box */}
      <div className="relative mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: 250 рублей, максимум белка после зала..."
            className="w-full pl-4 pr-24 sm:pr-32 py-3.5 sm:py-4 rounded-full bg-white border border-gray-200 text-xs sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-500 focus:border-transparent shadow-sm transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-apple-400" />
                <span className="hidden xs:inline">Считаю...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-apple-400" />
                <span>Собрать</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
        <span className="text-xs text-gray-500 font-semibold mr-1">Быстрые цели:</span>
        {presets.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleGenerate(preset.text)}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium bg-white/90 border border-gray-200 shadow-2xs transition-all active:scale-95 disabled:opacity-50 ${preset.color}`}
            >
              <Icon className="w-3.5 h-3.5 text-apple-600 flex-shrink-0" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white/95 backdrop-blur rounded-28 p-6 border border-apple-200 text-center animate-pulse shadow-sm">
          <div className="inline-flex p-3 rounded-full bg-apple-100 text-apple-700 mb-3">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <p className="font-semibold text-gray-900 text-sm">Ньютон AI калибрует формулу идеального обеда...</p>
          <p className="text-xs text-gray-500 font-mono mt-1">Оптимизация: стоимость ≤ бюджет • калории • БЖУ</p>
        </div>
      )}

      {/* AI Recommendation Result Card */}
      {recommendation && !loading && (
        <div className="relative bg-white rounded-28 border border-apple-300/80 p-4 sm:p-6 shadow-card-hover animate-fadeIn">
          
          {/* Newton Comment */}
          <div className="flex items-start gap-3 sm:gap-3.5 mb-5 pb-5 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-apple-500 to-emerald-400 flex-shrink-0 flex items-center justify-center text-white shadow-apple-sm text-lg">
              🍏
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-apple-800 bg-apple-100 px-2.5 py-0.5 rounded-full font-mono">
                  Вердикт Ньютон AI
                </span>
                <span className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  recommendation.source === 'gemini' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${recommendation.source === 'gemini' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span>{recommendation.source === 'gemini' ? 'Live Gemini 3.8 Flash' : 'Offline Smart Core'}</span>
                </span>
              </div>
              <p className="text-xs sm:text-base text-gray-800 font-medium leading-relaxed">
                «{recommendation.reasoning}»
              </p>
            </div>
          </div>

          {/* Recommended Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {recommendation.selectedDishes.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center gap-3 p-3 rounded-20 bg-[#F5F5F7] border border-gray-100 hover:border-apple-300 transition-colors"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-14 h-14 rounded-16 object-cover flex-shrink-0 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={dish.name}>
                    {dish.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                    <span className="font-bold text-gray-900">{dish.price} ₽</span>
                    <span>•</span>
                    <span>{dish.calories} ккал</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-mono mt-0.5">
                    Б: {dish.proteins}г • Ж: {dish.fats}г • У: {dish.carbs}г
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Add to tray button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <div className="bg-gray-100 px-3.5 py-1.5 rounded-full font-bold text-gray-900">
                Итого: <span className="text-base text-black font-extrabold">{recommendation.totalPrice} ₽</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/50 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{recommendation.totalCalories} ккал</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-gray-600 px-1">
                <span>Б: <strong className="text-purple-700">{recommendation.totalProteins}г</strong></span>
                <span>Ж: <strong className="text-amber-700">{recommendation.totalFats}г</strong></span>
                <span>У: <strong className="text-blue-700">{recommendation.totalCarbs}г</strong></span>
              </div>
            </div>

            {/* Big 1-Click Button */}
            <button
              onClick={handleApplyCombo}
              className={`px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 shadow-apple-sm transition-all active:scale-95 ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-apple-500 hover:bg-apple-400 text-black shadow-glow-apple'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span>Сет добавлен на поднос! 🍏</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Закинуть весь сет на поднос в 1 клик</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
