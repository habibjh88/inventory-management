import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialFoods, initialWasteLogs, defaultCategories, defaultReasons, defaultThreshold } from "@/data/initialData";
import { remainingOf, totals } from "@/utils/calculations";

const STORAGE_KEY = "fiwm:state:v1";

const InventoryContext = createContext(null);

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const InventoryProvider = ({ children }) => {
  const [state, setState] = useState(() =>
    loadState() || {
      foods: initialFoods,
      waste: initialWasteLogs,
      categories: defaultCategories,
      reasons: defaultReasons,
      threshold: defaultThreshold,
    },
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addFood = (f) => {
    setState((s) => ({
      ...s,
      foods: [
        ...s.foods,
        {
          id: f.id || `food-${Math.random().toString(36).slice(2, 9)}`,
          name: f.name,
          category: f.category,
          unit: f.unit,
          dateAdded: f.dateAdded,
          initialQty: f.initialQty,
          soldQty: 0,
          wasteQty: 0,
        },
      ],
    }));
  };

  const setSold = (id, soldQty) => {
    setState((s) => ({
      ...s,
      foods: s.foods.map((f) => (f.id === id ? { ...f, soldQty: Math.max(0, Math.min(soldQty, f.initialQty - f.wasteQty)) } : f)),
    }));
  };

  const addWaste = ({ foodId, quantity, reason, date }) => {
    setState((s) => {
      const food = s.foods.find((f) => f.id === foodId);
      if (!food) return s;
      const maxAllowed = remainingOf(food);
      const qty = Math.max(0, Math.min(quantity, maxAllowed));
      const w = {
        id: `w-${Math.random().toString(36).slice(2, 9)}`,
        foodId,
        foodName: food.name,
        quantity: qty,
        reason,
        date: date || new Date().toISOString(),
      };
      return {
        ...s,
        waste: [w, ...s.waste],
        foods: s.foods.map((f) => (f.id === foodId ? { ...f, wasteQty: f.wasteQty + qty } : f)),
      };
    });
  };

  const removeWaste = (wasteId) => {
    setState((s) => {
      const entry = s.waste.find((w) => w.id === wasteId);
      if (!entry) return s;
      return {
        ...s,
        waste: s.waste.filter((w) => w.id !== wasteId),
        foods: s.foods.map((f) => (f.id === entry.foodId ? { ...f, wasteQty: Math.max(0, f.wasteQty - entry.quantity) } : f)),
      };
    });
  };

  const setThreshold = (n) => setState((s) => ({ ...s, threshold: Math.max(0, Math.floor(n)) }));
  const addCategory = (c) => setState((s) => ({ ...s, categories: Array.from(new Set([...s.categories, c])).sort() }));
  const removeCategory = (c) => setState((s) => ({ ...s, categories: s.categories.filter((x) => x !== c) }));
  const addReason = (r) => setState((s) => ({ ...s, reasons: Array.from(new Set([...s.reasons, r])).sort() }));
  const removeReason = (r) => setState((s) => ({ ...s, reasons: s.reasons.filter((x) => x !== r) }));

  const value = useMemo(
    () => ({
      ...state,
      addFood,
      setSold,
      addWaste,
      removeWaste,
      setThreshold,
      addCategory,
      removeCategory,
      addReason,
      removeReason,
      getTotals: () => totals(state.foods),
      getLowStock: () => state.foods.filter((f) => remainingOf(f) < state.threshold),
    }),
    [state],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
};
