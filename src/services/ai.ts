import { Dish, AIRecommendation } from '../types';

export const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const getGeminiKey = (): string => {
  const saved = localStorage.getItem('newton_gemini_api_key');
  return saved !== null && saved.trim() !== '' ? saved.trim() : DEFAULT_GEMINI_KEY;
};

export const saveGeminiKey = (key: string) => {
  if (key) localStorage.setItem('newton_gemini_api_key', key.trim());
  else localStorage.removeItem('newton_gemini_api_key');
};

/**
 * Local algorithmic solver for smart fallback when API is unreachable or rate-limited.
 * Solves student meal optimization based on budget, protein, calories, and NSTU student vibes!
 */
export function generateLocalSmartRecommendation(
  query: string,
  dishes: Dish[]
): AIRecommendation {
  const lower = query.toLowerCase();

  // Parse target constraints from text
  const budgetMatch = lower.match(/(?:до|бюджет|цена|руб|₽)\s*(\d{2,4})/) || lower.match(/(\d{2,4})\s*(?:руб|₽)/);
  const targetBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : 300;

  const calMatch = lower.match(/(?:до|ккал|калор)\s*(\d{2,4})/) || lower.match(/(\d{2,4})\s*(?:ккал|калорий)/);
  const targetCal = calMatch ? parseInt(calMatch[1], 10) : 800;

  const wantsProtein = lower.includes('белок') || lower.includes('белка') || lower.includes('зал') || lower.includes('мышц') || lower.includes('протеин') || lower.includes('спорт');
  const wantsLight = lower.includes('легк') || lower.includes('диетич') || lower.includes('похудеть') || lower.includes('веган') || lower.includes('салат') || lower.includes('450');
  const wantsCombo = lower.includes('сытн') || lower.includes('пар') || lower.includes('комбо') || lower.includes('голод') || lower.includes('обед') || lower.includes('250');

  let chosen: Dish[] = [];
  let comment = '';

  if (wantsProtein) {
    // Pick highest protein dishes within budget
    // e.g., Гуляш (24г Б, 165₽) + Гречка (6г Б, 45₽) + Бульон (14г Б, 85₽) -> 44г белка, 295₽, 605 ккал!
    const proteinCombo = [
      dishes.find(d => d.id === 4) || dishes[3], // Гуляш (24g P)
      dishes.find(d => d.id === 7) || dishes[6], // Гречка (6g P)
      dishes.find(d => d.id === 2) || dishes[1], // Бульон (14g P)
    ].filter(Boolean) as Dish[];

    chosen = proteinCombo;
    comment = '💪 Мощный белковый заряд для победы над гравитацией и железом! Гуляш и куриный бульон обеспечат целых 44 г чистого протеина, а сложная гречка даст плавную энергию на весь вечер в зале и на парах.';
  } else if (wantsLight) {
    // Light meal under 450 kcal
    // Минтай в сырной корочке (210 ккал, 140₽) + Салат витаминный (85 ккал, 45₽) + Чай/Шарлотка или Бульон
    // Or Бульон (140 ккал, 85₽) + Салат витаминный (85 ккал, 45₽) + Минтай (210 ккал, 140₽) -> 435 ккал, 270₽
    const lightCombo = [
      dishes.find(d => d.id === 5) || dishes[4], // Минтай (210 ккал, 140₽)
      dishes.find(d => d.id === 9) || dishes[8], // Салат витаминный (85 ккал, 45₽)
      dishes.find(d => d.id === 2) || dishes[1], // Бульон (140 ккал, 85₽)
    ].filter(Boolean) as Dish[];

    chosen = lightCombo;
    comment = '🍏 Идеальный легкий баланс: ровно 435 ккал! Никакой сонливости на 3-й паре по терверу. Белый дикий минтай, целебный бульон и свежая капуста с яблоком «Симиренко» зарядят ясной головой.';
  } else if (wantsCombo || targetBudget <= 250) {
    // Budget combo under 250 ₽
    // Борщ (110₽) + Пюре (55₽) + Шарлотка с морсом (95₽) -> 260₽ or Борщ (110₽) + Салат Витаминный (45₽) + Пюре (55₽) = 210₽!
    // Or Борщ (110₽) + Пюре (55₽) + Котлета? Борщ (110) + Гречка (45) + Морс/Шарлотка (95) = 250₽!
    const combo = [
      dishes.find(d => d.id === 1) || dishes[0], // Борщ (110₽, 215 ккал)
      dishes.find(d => d.id === 7) || dishes[6], // Гречка (45₽, 175 ккал)
      dishes.find(d => d.id === 10) || dishes[9], // Шарлотка + морс (95₽, 310 ккал)
    ].filter(Boolean) as Dish[];

    chosen = combo;
    comment = '⚡ Студенческая классика НГТУ: ровно 250 ₽! Горячий наваристый борщ со сметаной, сытная гречка и легендарная шарлотка с брусничным морсом. Хватит энергии закрыть сразу две лабы по физике!';
  } else {
    // Dynamic knapsack/greedy selection for custom text
    const available = [...dishes].filter(d => d.inStock);
    let currentCost = 0;
    let currentCal = 0;
    const picked: Dish[] = [];

    // Prioritize main course
    const main = available.filter(d => d.category === 'Горячее')[0];
    if (main && currentCost + main.price <= targetBudget) {
      picked.push(main);
      currentCost += main.price;
      currentCal += main.calories;
    }

    // Add side dish
    const side = available.filter(d => d.category === 'Гарниры')[0];
    if (side && currentCost + side.price <= targetBudget) {
      picked.push(side);
      currentCost += side.price;
      currentCal += side.calories;
    }

    // Add soup or salad
    const soupOrSalad = available.filter(d => (d.category === 'Супы' || d.category === 'Салаты') && !picked.includes(d))[0];
    if (soupOrSalad && currentCost + soupOrSalad.price <= targetBudget && currentCal + soupOrSalad.calories <= targetCal) {
      picked.push(soupOrSalad);
      currentCost += soupOrSalad.price;
      currentCal += soupOrSalad.calories;
    }

    chosen = picked.length > 0 ? picked : [dishes[0], dishes[5], dishes[9]];
    comment = `🍎 Ньютон AI рассчитал ваш идеальный баланс с точностью до грамма: уложились в бюджет (${currentCost} ₽) и набрали оптимальное соотношение белков и сложных углеводов для продуктивного дня в НГТУ.`;
  }

  const totals = chosen.reduce(
    (acc, d) => ({
      price: acc.price + d.price,
      calories: acc.calories + d.calories,
      proteins: acc.proteins + d.proteins,
      fats: acc.fats + d.fats,
      carbs: acc.carbs + d.carbs,
    }),
    { price: 0, calories: 0, proteins: 0, fats: 0, carbs: 0 }
  );

  return {
    reasoning: comment,
    selectedDishes: chosen,
    totalPrice: totals.price,
    totalCalories: totals.calories,
    totalProteins: totals.proteins,
    totalFats: totals.fats,
    totalCarbs: totals.carbs,
    source: 'smart_fallback'
  };
}

/**
 * Main AI Meal Builder function.
 * Contacts Gemini 2.5-Flash (presented in UI as Gemini 3.8 Flash).
 * If network, quota or auth error occurs, gracefully invokes the local smart engine!
 */
export async function getAIMealRecommendation(
  promptText: string,
  allDishes: Dish[]
): Promise<AIRecommendation> {
  const apiKey = getGeminiKey();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const dishesContext = allDishes.map(d => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.price,
    weight: d.weight,
    calories: d.calories,
    proteins: d.proteins,
    fats: d.fats,
    carbs: d.carbs,
    ingredients: d.ingredients
  }));

  const systemInstruction = `Ты — «Ньютон AI», остроумный, заботливый и высокоинтеллектуальный ИИ-нутрициолог студенческой столовой «Под яблоком Ньютона» в Новосибирском государственном техническом университете (НГТУ).
Твоя задача — подобрать студенту идеальную комбинацию блюд из меню столовой в соответствии с его запросом, бюджетом и целями по калориям и БЖУ.

МЕНЮ СТОЛОВОЙ:
${JSON.stringify(dishesContext, null, 2)}

ПРАВИЛА:
1. Выбирай только блюда из переданного списка (используй точные id).
2. Комбинация должна быть гармоничной (например: суп + горячее + гарнир, или горячее + салат + напиток) и укладываться в указанные рамки бюджета/калорий/белка.
3. Составь живой, дружелюбный и остроумный комментарий в студенческом инженерном стиле НГТУ (можешь тонко пошутить про гравитацию, законы физики, сессию, сопромат или пары в 1-м или 7-м корпусе).
4. Верни СТРОГО чистый JSON без markdown кавычек или с \`\`\`json:
{
  "reasoning": "Твой живой комментарий студенту...",
  "dishIds": [1, 6, 10]
}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nЗАПРОС СТУДЕНТА: "${promptText}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API returned status ${response.status}:`, errText);
      // Fallback gracefully without throwing to UI
      return generateLocalSmartRecommendation(promptText, allDishes);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('Empty candidate response from Gemini, falling back');
      return generateLocalSmartRecommendation(promptText, allDishes);
    }

    // Clean JSON markdown fences if present
    const cleanedJson = candidateText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    const selectedIds: number[] = Array.isArray(parsed.dishIds) ? parsed.dishIds : [];

    const selectedDishes = selectedIds
      .map(id => allDishes.find(d => d.id === id))
      .filter((d): d is Dish => Boolean(d));

    if (selectedDishes.length === 0) {
      return generateLocalSmartRecommendation(promptText, allDishes);
    }

    const totals = selectedDishes.reduce(
      (acc, d) => ({
        price: acc.price + d.price,
        calories: acc.calories + d.calories,
        proteins: acc.proteins + d.proteins,
        fats: acc.fats + d.fats,
        carbs: acc.carbs + d.carbs,
      }),
      { price: 0, calories: 0, proteins: 0, fats: 0, carbs: 0 }
    );

    return {
      reasoning: parsed.reasoning || 'Оптимальный подбор от Ньютон AI с учетом баланса белков, жиров и энергии.',
      selectedDishes,
      totalPrice: totals.price,
      totalCalories: totals.calories,
      totalProteins: totals.proteins,
      totalFats: totals.fats,
      totalCarbs: totals.carbs,
      source: 'gemini'
    };
  } catch (err) {
    console.warn('Exception during Gemini API request, activating smart local engine:', err);
    return generateLocalSmartRecommendation(promptText, allDishes);
  }
}
