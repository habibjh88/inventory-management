export const defaultCategories = [
  "Produce",
  "Bakery",
  "Dairy",
  "Meat",
  "Beverages",
  "Prepared",
];

export const defaultReasons = [
  "Expired",
  "Damaged",
  "Spoiled",
  "Broken",
  "Returned",
];

export const initialFoods = [
  {
    id: "f-apple",
    name: "Apples",
    category: "Produce",
    unit: "kg",
    dateAdded: new Date().toISOString(),
    initialQty: 120,
    soldQty: 40,
    wasteQty: 5,
  },
  {
    id: "f-bread",
    name: "Whole Wheat Bread",
    category: "Bakery",
    unit: "pcs",
    dateAdded: new Date().toISOString(),
    initialQty: 60,
    soldQty: 32,
    wasteQty: 6,
  },
  {
    id: "f-milk",
    name: "Milk",
    category: "Dairy",
    unit: "liters",
    dateAdded: new Date().toISOString(),
    initialQty: 80,
    soldQty: 50,
    wasteQty: 3,
  },
  {
    id: "f-chicken",
    name: "Chicken Breast",
    category: "Meat",
    unit: "kg",
    dateAdded: new Date().toISOString(),
    initialQty: 90,
    soldQty: 20,
    wasteQty: 2,
  },
  {
    id: "f-salad",
    name: "Prepared Salad",
    category: "Prepared",
    unit: "pcs",
    dateAdded: new Date().toISOString(),
    initialQty: 40,
    soldQty: 14,
    wasteQty: 4,
  },
  {
    id: "f-juice",
    name: "Orange Juice",
    category: "Beverages",
    unit: "liters",
    dateAdded: new Date().toISOString(),
    initialQty: 70,
    soldQty: 25,
    wasteQty: 1,
  },
];

export const initialWasteLogs = [
  {
    id: "w1",
    foodId: "f-bread",
    foodName: "Whole Wheat Bread",
    quantity: 3,
    reason: "Expired",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "w2",
    foodId: "f-apple",
    foodName: "Apples",
    quantity: 2,
    reason: "Spoiled",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "w3",
    foodId: "f-milk",
    foodName: "Milk",
    quantity: 1,
    reason: "Damaged",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

export const defaultThreshold = 10;
