type CalorieTracker = {
  date: Date;
  totalCalories: number;
  totalFats: number;
  totalCarbs: number;
  totalProtein: number;
  foods: Array<FoodItem>;
};

type FoodItem = {
  name: string;
  brand?: string;
  tags?: Set<string>;
  nutrition: NutritionInfo;
};

type NutritionInfo = {
  servingSize: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  other: Map<string, number>;
};
