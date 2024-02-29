import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import tables from "@/utils/tables";
import {
  CalorieTracker,
  CalorieTrackerFromDatabase,
  FoodItem,
} from "@/models/Food";
import { DalModel, DocRef } from "@/models/Data";
import {
  dbCalorieTrackerToRegularTracker,
  getMacroPerHundredGrams,
} from "@/utils/utils";

const EMPTY_OBJECT = {};

class FirebaseDal implements DalModel {
  userId = "";
  accountRef: DocRef;
  calorieRef: DocRef;

  constructor(id: string) {
    this.userId = id;
    this.accountRef = doc(db, tables.users, this.userId);
    this.calorieRef = doc(db, tables.calories, this.userId);
  }

  // Account Methods

  /**
   * Generates an empty Calorie Tracker
   * @returns A new initialized Calorie Tracker
   */
  private generateEmptyCalorieTracker(): CalorieTracker {
    return {
      date: new Date(Date.now()),
      totalCalories: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalProtein: 0,
      foods: [],
    };
  }

  /**
   * Generates an object that contains a new Account and Calorie Tracker
   * @param name The name for the new account
   * @param id A user ID
   * @returns A object containing a new user account and calorie tracker
   */
  private generateEmptyModels(
    name: string,
    id: string
  ): { account: AccountModel; calories: Array<CalorieTracker> } {
    const calories: Array<CalorieTracker> = [
      this.generateEmptyCalorieTracker(),
    ];

    const account: AccountModel = {
      name,
      id,
    };

    return { account, calories };
  }

  /**
   * Prototype method for creating a user with email and password authentication
   * @param name The name of the User
   * @param email The user's email
   * @param password The user's password
   * @returns A Promise of a new Firebase User object.
   */
  async createUserWithEmailPassword(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userId = userCredential.user.uid;

    const newItems = this.generateEmptyModels(name, userId);
    const accountRef = doc(db, tables.users, userId);
    const calorieRef = doc(db, tables.calories, userId);
    await setDoc(accountRef, newItems.account);
    await setDoc(calorieRef, { calorieList: newItems.calories });

    return userCredential.user;
  }

  async signInUserWithEmailPassword(
    email: string,
    password: string
  ): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  }

  async getUserData(): Promise<object | AccountModel> {
    try {
      const userData = (await getDoc(this.accountRef)).data();

      if (!userData) {
        throw new Error(`Data for user ID ${this.userId} could not be found!`);
      }

      return userData as AccountModel;
    } catch (e: any) {
      console.error(e.message);
      return EMPTY_OBJECT;
    }
  }

  async addFoodToUser(foodTotals: FoodItem): Promise<void> {
    const fetchedCalorieTracker = await this.getCalorieData();

    if (Object.keys(fetchedCalorieTracker).length === 0) {
      console.error("Calorie Tracker was not fetched");
      return;
    }

    const calorieTracker = fetchedCalorieTracker as CalorieTrackerFromDatabase;
    const moddedDailyTracker =
      calorieTracker.calorieList[calorieTracker.calorieList.length - 1];

    moddedDailyTracker.totalCalories += foodTotals.nutrition.calories;
    moddedDailyTracker.totalFats += foodTotals.nutrition.fat;
    moddedDailyTracker.totalCarbs += foodTotals.nutrition.carbs;
    moddedDailyTracker.totalProtein += foodTotals.nutrition.protein;

    moddedDailyTracker.foods.push(foodTotals.name);

    calorieTracker.calorieList[calorieTracker.calorieList.length - 1] =
      moddedDailyTracker;

    await setDoc(this.calorieRef, calorieTracker);
  }

  // Calorie Tracker Methods

  async getCalorieData(): Promise<object | CalorieTrackerFromDatabase> {
    try {
      const calorieData = (await getDoc(this.calorieRef)).data();

      if (!calorieData) {
        throw new Error(
          `Calorie data for user ID ${this.userId} could not be found!`
        );
      }

      return calorieData;
    } catch (e: any) {
      console.error(e.message);
      return EMPTY_OBJECT;
    }
  }

  addCalorieTracker(tracker: CalorieTracker[]): CalorieTracker {
    tracker.push(this.generateEmptyCalorieTracker());

    setDoc(this.calorieRef, { calorieList: tracker });

    return tracker[tracker.length - 1];
  }

  // Food Methods

  async addFood(food: FoodItem): Promise<void> {
    food.name = food.name.toLowerCase();
    const foodDoc = doc(db, tables.foods, food.name);
    const foodDocExists = (await getDoc(foodDoc)).data();
    console.log(foodDocExists);

    if (foodDocExists) {
      console.error(`Food item ${food.name} already exists!`);
      return;
    }

    const info = [food.nutrition.fat, food.nutrition.carbs];

    const mostCalsFromProtein: boolean =
      food.nutrition.protein >= Math.max(...info);
    const calsPerHundredGrams = getMacroPerHundredGrams(
      Number(food.nutrition.servingSize),
      food.nutrition.calories
    );
    const fatPerHundredGrams = getMacroPerHundredGrams(
      Number(food.nutrition.servingSize),
      food.nutrition.fat
    );
    const carbsPerHundredGrams = getMacroPerHundredGrams(
      Number(food.nutrition.servingSize),
      food.nutrition.carbs
    );
    const proteinPerHundredGrams = getMacroPerHundredGrams(
      Number(food.nutrition.servingSize),
      food.nutrition.protein
    );

    food.nutrition = {
      ...food.nutrition,
      mostCalsFromProtein,
      calsPerHundredGrams,
      fatPerHundredGrams,
      carbsPerHundredGrams,
      proteinPerHundredGrams,
    };

    return await setDoc(doc(db, tables.foods, `${food.name}`), food.nutrition);
  }

  async getFood(foodName: string): Promise<FoodItem | undefined> {
    foodName = foodName.toLowerCase();
    try {
      const foodRef = doc(db, tables.foods, foodName);
      const foodData = (await getDoc(foodRef)).data();

      if (!foodData) {
        throw new Error(`Food data for name ${foodName} could not be found!`);
      }

      return { nutrition: foodData, name: foodName } as FoodItem;
    } catch (e: any) {
      console.error(e.message);
      return undefined;
    }
  }
}

export default FirebaseDal;
