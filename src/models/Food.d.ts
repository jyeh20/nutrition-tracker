import { Timestamp } from "firebase/firestore";
import { MutableRefObject } from "react";

type CalorieTrackerFromDatabase = {
  calorieList: DbCalorieTracker[];
};

type DbCalorieTracker = {
  date: Timestamp;
  totalCalories: number;
  totalFats: number;
  totalCarbs: number;
  totalProtein: number;
  foods: Array<string>;
};

type CalorieTracker = {
  date: Date;
  totalCalories: number;
  totalFats: number;
  totalCarbs: number;
  totalProtein: number;
  foods: Array<string>;
};

type FoodItem = {
  name: string;
  nutrition: NutritionInfo;
};

type NutritionInfo = {
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  servingSize?: number;
  mostCalsFromProtein?: boolean;
  calsPerHundredGrams?: number;
  fatPerHundredGrams?: number;
  carbsPerHundredGrams?: number;
  proteinPerHundredGrams?: number;
};

// export enum DispatchStrings {
//   servingSize,
//   calorie,
//   fat,
//   carbs,
//   protein,
// }

type AddFoodFormProps = {
  handleTextUpdate: function;
  foodRef: MutableRefObject;
};

type ConfirmFoodFormProps = {
  foodData: object;
  displayData: {
    calories;
    fat;
    carbs;
    protein;
  };
};
