export const categoryType = {
  1: "Breakfast",
  2: "Cereals",
  3: "Vegetable",
  4: "Sweets",
  5: "Default",
  6: "Miscellaneous",
};

export const mealType = {
  breakfast: 1,
  lunch: 2,
  dinner: 3,
};
export interface Item {
  name?: string;
  price?: number;
  categoryId?: number;
  availabilityStatus?: boolean;
}

export interface Notification {
  message: string;
  notificationType: number;
  receiverStatusCode: number;
}
