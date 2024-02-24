import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import tables from "@/utils/tables";

class FoodDal {
  private generateFoodId(food: FoodItem): string {
    return food.name + food.brand + food.tags?.join();
  }

  async addFoodToDb(food: FoodItem) {
    await setDoc(doc(db, tables.foods, this.generateFoodId(food)), food);
  }

  async removeFoodFromDb(foodId: string) {
    await deleteDoc(doc(db, tables.foods, foodId));
  }
}

export default FoodDal;
