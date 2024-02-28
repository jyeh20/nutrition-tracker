import { DocumentData, DocumentReference } from "firebase/firestore";
import { CalorieTracker, CalorieTrackerFromDatabase, FoodItem } from "./Food";

type DocRef = DocumentReference<DocumentData, DocumentData>;

interface DalModel {
  userId: string;
  accountRef: DocRef;
  calorieRef: DocRef;

  // Account

  createUserWithEmailPassword(
    name: string,
    email: string,
    password: string
  ): Promise<User>;
  signInUserWithEmailPassword(email: string, password: string): Promise<User>;
  getUserData(): Promise<AccountModel | object>;
  addFoodToUser(food: FoodItem): Promise<void>;

  // Calorie Tracker

  getCalorieData(): Promise<CalorieTrackerFromDatabase | object>;
  addCalorieTracker(tracker: Array<CalorieTracker>): CalorieTracker;

  // Food

  addFood(food: FoodItem): Promise<void>;
  getFood(foodName: string): Promise<FoodItem | undefined>;
}
