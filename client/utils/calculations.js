export const remainingOf = (item) => Math.max(0, item.initialQty - (item.soldQty + item.wasteQty));

export const statusOf = (item) => {
  const rem = remainingOf(item);
  const ratio = item.initialQty === 0 ? 0 : rem / item.initialQty;
  if (ratio > 0.5) return { label: "Fresh", color: "bg-emerald-500" };
  if (ratio > 0.2) return { label: "Low", color: "bg-amber-500" };
  return { label: "Critical", color: "bg-red-500" };
};

export const totals = (foods) => {
  const totalItems = foods.length;
  const totalSold = foods.reduce((s, f) => s + f.soldQty, 0);
  const totalWaste = foods.reduce((s, f) => s + f.wasteQty, 0);
  const totalRemaining = foods.reduce((s, f) => s + remainingOf(f), 0);
  return { totalItems, totalSold, totalWaste, totalRemaining };
};

export const groupByDate = (entries) => {
  const map = new Map();
  for (const e of entries) {
    const key = e.date.slice(0, 10);
    const prev = map.get(key) || { date: key, sold: 0, waste: 0 };
    map.set(key, { date: key, sold: prev.sold + (e.sold || 0), waste: prev.waste + (e.waste || 0) });
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const wasteByReason = (waste) => {
  const map = new Map();
  for (const w of waste) map.set(w.reason, (map.get(w.reason) || 0) + w.quantity);
  return Array.from(map, ([reason, value]) => ({ reason, value }));
};
