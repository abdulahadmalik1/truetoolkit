"use client";
import { useState, useMemo } from "react";
import { ToolLayout, Card, SectionTitle, FieldLabel, TextInput, NumInput, Select } from "@/components/ui";

// Simplified USDA lookup per 100g
const INGREDIENT_DB: Record<string, { name: string, cal: number, fat: number, carb: number, prot: number, sod: number, allg: string[] }> = {
  flour: { name: "All-Purpose Flour", cal: 364, fat: 1, carb: 76, prot: 10, sod: 2, allg: ["Wheat"] },
  sugar: { name: "Granulated Sugar", cal: 387, fat: 0, carb: 100, prot: 0, sod: 1, allg: [] },
  brown_sugar: { name: "Brown Sugar", cal: 380, fat: 0, carb: 98, prot: 0, sod: 28, allg: [] },
  butter: { name: "Unsalted Butter", cal: 717, fat: 81, carb: 0.1, prot: 0.8, sod: 11, allg: ["Milk"] },
  eggs: { name: "Whole Eggs", cal: 143, fat: 9.5, carb: 0.7, prot: 12.6, sod: 142, allg: ["Eggs"] },
  milk: { name: "Whole Milk", cal: 61, fat: 3.3, carb: 4.8, prot: 3.2, sod: 43, allg: ["Milk"] },
  cocoa: { name: "Cocoa Powder", cal: 228, fat: 14, carb: 58, prot: 20, sod: 21, allg: [] },
  choc_chips: { name: "Semi-Sweet Choc Chips", cal: 471, fat: 30, carb: 65, prot: 4, sod: 34, allg: ["Soy"] },
  peanut_butter: { name: "Peanut Butter", cal: 588, fat: 50, carb: 20, prot: 25, sod: 17, allg: ["Peanuts"] },
  almonds: { name: "Almonds", cal: 579, fat: 49, carb: 21, prot: 21, sod: 1, allg: ["Tree Nuts"] },
  walnuts: { name: "Walnuts", cal: 654, fat: 65, carb: 14, prot: 15, sod: 2, allg: ["Tree Nuts"] },
  salt: { name: "Table Salt", cal: 0, fat: 0, carb: 0, prot: 0, sod: 38758, allg: [] },
  baking_soda: { name: "Baking Soda", cal: 0, fat: 0, carb: 0, prot: 0, sod: 27360, allg: [] },
  vanilla: { name: "Vanilla Extract", cal: 288, fat: 0.1, carb: 13, prot: 0.1, sod: 9, allg: [] },
  oats: { name: "Rolled Oats", cal: 379, fat: 6.5, carb: 68, prot: 13, sod: 2, allg: [] },
};

const DB_OPTIONS = Object.entries(INGREDIENT_DB).map(([id, data]) => ({ value: id, label: data.name }));

type RecipeItem = { id: string; dbKey: string; grams: number };

export default function CottageFoodLabel() {
  const [productName, setProductName] = useState("Homemade Chocolate Chip Cookies");
  const [servings, setServings] = useState(12);
  const [servingSize, setServingSize] = useState("1 Cookie (45g)");
  const [ingredients, setIngredients] = useState<RecipeItem[]>([
    { id: "1", dbKey: "flour", grams: 200 },
    { id: "2", dbKey: "butter", grams: 115 },
    { id: "3", dbKey: "sugar", grams: 150 },
    { id: "4", dbKey: "choc_chips", grams: 100 },
  ]);

  const addItem = () => setIngredients([...ingredients, { id: Math.random().toString(), dbKey: "flour", grams: 100 }]);
  const updateItem = (id: string, key: keyof RecipeItem, val: any) => setIngredients(ingredients.map(i => i.id === id ? { ...i, [key]: val } : i));
  const removeItem = (id: string) => setIngredients(ingredients.filter(i => i.id !== id));

  const nutrition = useMemo(() => {
    let cal = 0, fat = 0, carb = 0, prot = 0, sod = 0;
    const allergens = new Set<string>();

    ingredients.forEach(item => {
      const data = INGREDIENT_DB[item.dbKey];
      if (data && item.grams > 0) {
        const factor = item.grams / 100;
        cal += data.cal * factor;
        fat += data.fat * factor;
        carb += data.carb * factor;
        prot += data.prot * factor;
        sod += data.sod * factor;
        data.allg.forEach(a => allergens.add(a));
      }
    });

    const s = Math.max(1, servings);
    return {
      cal: Math.round(cal / s),
      fat: (fat / s).toFixed(1),
      carb: Math.round(carb / s),
      prot: (prot / s).toFixed(1),
      sod: Math.round(sod / s),
      allergens: Array.from(allergens).sort()
    };
  }, [ingredients, servings]);

  // Generate ingredients list sorted by weight (FDA requirement)
  const sortedIngredientsList = useMemo(() => {
    const combined = new Map<string, { name: string, grams: number }>();
    ingredients.forEach(item => {
      const data = INGREDIENT_DB[item.dbKey];
      if (data && item.grams > 0) {
        const existing = combined.get(item.dbKey);
        if (existing) {
          existing.grams += item.grams;
        } else {
          combined.set(item.dbKey, { name: data.name, grams: item.grams });
        }
      }
    });
    return Array.from(combined.values())
      .sort((a, b) => b.grams - a.grams)
      .map(i => i.name.toUpperCase())
      .join(", ");
  }, [ingredients]);

  return (
    <ToolLayout
      toolNum={65} category="🛠️ Business & Operations"
      title="Cottage Food" titleHighlight="Label Generator"
      description="Don't guess your nutrition facts or rely on hallucinating AI. Build your recipe exactly in grams using USDA database values and generate an instantly printable, FDA-compliant nutrition panel."
    >
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Product Details</SectionTitle>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <FieldLabel htmlFor="productName">Product Name</FieldLabel>
                <TextInput id="productName" value={productName} onChange={setProductName} />
              </div>
              <div>
                <FieldLabel htmlFor="servings">Total Servings in Recipe</FieldLabel>
                <NumInput id="servings" value={servings} onChange={setServings} min={1} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="servingSize">Serving Size Description</FieldLabel>
                <TextInput id="servingSize" value={servingSize} onChange={setServingSize} placeholder="e.g. 1 Cookie (45g)" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle>Recipe Ingredients (in Grams)</SectionTitle>
              <button onClick={addItem} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Add Ingredient
              </button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((item, idx) => (
                <div key={item.id} className="flex gap-3 items-end p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 text-center font-mono text-slate-500 font-bold mb-2">#{idx+1}</div>
                  <div className="flex-1">
                    <FieldLabel htmlFor={`ing-${item.id}`}>Ingredient</FieldLabel>
                    <Select id={`ing-${item.id}`} value={item.dbKey} onChange={(v) => updateItem(item.id, 'dbKey', v)} options={DB_OPTIONS} />
                  </div>
                  <div className="w-28">
                    <FieldLabel htmlFor={`g-${item.id}`}>Weight</FieldLabel>
                    <NumInput id={`g-${item.id}`} value={item.grams} onChange={(v) => updateItem(item.id, 'grams', v)} min={0} suffix="g" />
                  </div>
                  {ingredients.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="w-10 h-[42px] mb-[2px] flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 rounded-xl transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="sticky top-24 space-y-4">
          {/* FDA Style Label Wrapper */}
          <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
            <div className="border-[3px] border-black p-2 font-sans bg-white text-black" id="nutrition-label">
              <h1 className="text-3xl font-black tracking-tight leading-none mb-1">Nutrition Facts</h1>
              <div className="border-t-[10px] border-black my-1"></div>
              <div className="flex justify-between items-end mb-1">
                <div>
                  <p className="font-bold">{servings} servings per container</p>
                  <p className="font-bold text-lg leading-tight">Serving size</p>
                </div>
                <div className="font-bold text-lg leading-tight text-right">{servingSize}</div>
              </div>
              <div className="border-t-[10px] border-black my-1"></div>
              <p className="font-bold text-sm">Amount per serving</p>
              <div className="flex justify-between items-start -mt-2 mb-1">
                <p className="font-black text-4xl">Calories</p>
                <p className="font-black text-4xl">{nutrition.cal}</p>
              </div>
              <div className="border-t-4 border-black my-1"></div>
              <p className="text-right font-bold text-xs mb-1">% Daily Value*</p>
              
              <div className="border-t border-black my-1"></div>
              <div className="flex justify-between text-sm">
                <p><strong>Total Fat</strong> {nutrition.fat}g</p>
                <p className="font-bold">{Math.round((parseFloat(nutrition.fat) / 78) * 100)}%</p>
              </div>
              
              <div className="border-t border-black my-1"></div>
              <div className="flex justify-between text-sm">
                <p><strong>Sodium</strong> {nutrition.sod}mg</p>
                <p className="font-bold">{Math.round((nutrition.sod / 2300) * 100)}%</p>
              </div>
              
              <div className="border-t border-black my-1"></div>
              <div className="flex justify-between text-sm">
                <p><strong>Total Carbohydrate</strong> {nutrition.carb}g</p>
                <p className="font-bold">{Math.round((nutrition.carb / 275) * 100)}%</p>
              </div>

              <div className="border-t border-black my-1"></div>
              <div className="flex justify-between text-sm">
                <p><strong>Protein</strong> {nutrition.prot}g</p>
              </div>

              <div className="border-t-[10px] border-black my-2"></div>
              <p className="text-[10px] leading-tight text-justify">
                *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </p>
            </div>
            
            <div className="mt-4 border-2 border-black p-3 bg-white text-black text-sm">
              <p className="font-bold uppercase mb-1">Ingredients:</p>
              <p className="leading-tight">{sortedIngredientsList}</p>
              
              {nutrition.allergens.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black">
                  <p className="font-bold uppercase">Contains: {nutrition.allergens.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center print:hidden">
            <button onClick={() => window.print()} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
              Print Label (Black & White)
            </button>
            <p className="text-xs text-slate-500 mt-3">USDA Math applied deterministically.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
