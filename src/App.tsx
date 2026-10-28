import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AiAssistant } from './components/AiAssistant';
import { MenuFilter } from './components/MenuFilter';
import { DishCard } from './components/DishCard';
import { DishModal } from './components/DishModal';
import { TrayDrawer } from './components/TrayDrawer';
import { MobileTrayBar } from './components/MobileTrayBar';
import { SettingsModal } from './components/SettingsModal';
import { Dish, DishCategory, CartItem } from './types';
import { INITIAL_DISHES } from './data/dishes';
import { fetchDishes } from './services/supabase';
import { Utensils, Clock, MapPin } from 'lucide-react';

const CATEGORIES: (DishCategory | 'Все')[] = [
  'Все',
  'Супы',
  'Горячее',
  'Гарниры',
  'Салаты',
  'Выпечка и напитки',
];

export const App: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('newton_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('newton_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'Все'>('Все');
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [under200KcalOnly, setUnder200KcalOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [activeModalDish, setActiveModalDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadDishes = async () => {
    const res = await fetchDishes();
    setDishes(res.dishes);
    setIsSupabaseActive(res.source === 'supabase');
  };

  useEffect(() => {
    loadDishes();
  }, []);

  // Cart actions
  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (dishId: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dishId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.dish.id !== dishId);
      }
      return prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleAddComboToCart = (comboDishes: Dish[]) => {
    setCartItems((prev) => {
      const copy = [...prev];
      for (const dish of comboDishes) {
        const idx = copy.findIndex((item) => item.dish.id === dish.id);
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        } else {
          copy.push({ dish, quantity: 1 });
        }
      }
      return copy;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (selectedCategory !== 'Все' && dish.category !== selectedCategory) {
        return false;
      }
      if (highProteinOnly && dish.proteins < 15) {
        return false;
      }
      if (under200KcalOnly && dish.calories > 200) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesIngredients = dish.ingredients.toLowerCase().includes(q);
        if (!matchesName && !matchesIngredients) return false;
      }
      return true;
    });
  }, [dishes, selectedCategory, highProteinOnly, under200KcalOnly, searchQuery]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);

  const getDishQuantityInCart = (dishId: number) => {
    const item = cartItems.find((i) => i.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-[#0F172A]">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        totalPrice={totalCartPrice}
        isSupabaseActive={isSupabaseActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-16">
        
        {/* Hero Banner / Intro */}
        <section className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/70 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-100 text-apple-900 text-[11px] sm:text-xs font-bold mb-2.5 border border-apple-300/40">
              <span>🍏</span>
              <span>НГТУ • Сибирский инженерный стандарт качества</span>
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A] leading-tight">
              Студенческая столовая «Под яблоком Ньютона»
            </h1>
            <p className="mt-1.5 text-xs sm:text-base text-gray-500 max-w-2xl font-normal leading-relaxed">
              Питание с физической точностью: сбалансированное меню, прозрачный состав и мгновенный ИИ-расчет КБЖУ для продуктивной учебы.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-apple-600 flex-shrink-0" />
              <span>Пн–Сб: 08:30 – 17:30</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-apple-600 flex-shrink-0" />
              <span>НГТУ, 1-й учебный корпус</span>
            </span>
          </div>
        </section>

        {/* AI Meal Builder Killer Feature */}
        <AiAssistant
          dishes={dishes}
          onAddComboToCart={handleAddComboToCart}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Menu Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-apple-600" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Витрина блюд
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Цены актуальны на сегодня
            </span>
          </div>

          {/* Filters & Search */}
          <MenuFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            highProteinOnly={highProteinOnly}
            onToggleHighProtein={() => setHighProteinOnly(!highProteinOnly)}
            under200KcalOnly={under200KcalOnly}
            onToggleUnder200Kcal={() => setUnder200KcalOnly(!under200KcalOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFilteredCount={filteredDishes.length}
          />

          {/* Dishes Grid */}
          {filteredDishes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-28 border border-gray-200 p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-xl mb-3">
                🔍
              </div>
              <h3 className="font-bold text-gray-800 text-base">Блюда не найдены</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Попробуйте сбросить фильтры или изменить поисковый запрос
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Все');
                  setHighProteinOnly(false);
                  setUnder200KcalOnly(false);
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all active:scale-95"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  cartQuantity={getDishQuantityInCart(dish.id)}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onOpenDetails={(d) => setActiveModalDish(d)}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 sm:py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <span className="font-bold text-gray-900">Столовая «Под яблоком Ньютона»</span>
            <span>•</span>
            <span>НГТУ • NETI</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
            <span>Калории ➔ Ускорение ума 🧠</span>
            <span>•</span>
            <span className="text-apple-700 font-bold">F = m · a</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DishModal
        dish={activeModalDish}
        onClose={() => setActiveModalDish(null)}
        cartQuantity={activeModalDish ? getDishQuantityInCart(activeModalDish.id) : 0}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />

      <TrayDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <MobileTrayBar
        items={cartItems}
        onOpenTray={() => setIsCartOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRefreshData={loadDishes}
      />
    </div>
  );
};

export default App;
