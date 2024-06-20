export const mealType = {
  1: "Breakfast",
  2: "Cereals",
  3: "Vegetable",
  4: "Sweets",
  5: "Default",
  6: "Miscellaneous",
};

export interface Item {
  name?: string;
  price?: number;
  categoryId?: number;
  availabilityStatus?: boolean;
}
