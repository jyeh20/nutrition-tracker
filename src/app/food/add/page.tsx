"use client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ColoredTextField } from "@/components/ColoredTextField";
import { darkTheme } from "@/components/Theme";
import { useState, useEffect, useRef } from "react";
import { NutritionButton } from "@/components/Components";
import FirebaseDal from "@/data-access/firebaseInterface";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";
import useFoodStyles from "../style";
import { auth } from "@/firebase";
import { FoodItem } from "@/models/Food";
import {
  calculateMacroFromNormalizedValue,
  roundToHundreths,
} from "@/utils/utils";
import { DispatchStrings } from "../enums";
import AddFoodForm from "./AddFoodForm";
import ConfirmFoodForm from "./ConfirmFoodForm";

const emptyFoodItem: FoodItem = {
  name: "",
  nutrition: {
    servingSize: 0,
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  },
};

export default function AddFood() {
  const styles = useFoodStyles(darkTheme);
  const router = useRouter();
  const [dal, setDal] = useState({});
  const foodRef = useRef({
    nameError: false,
    servingError: false,
    calorieError: false,
    fatError: false,
    carbError: false,
    proteinError: false,
    foodItem: emptyFoodItem,
  });
  const [foodFound, setFoodFound] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fetchedFoodData, setFetchedFoodData] = useState({});
  const [calories, setCalories] = useState(0);
  const [fat, setFat] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [servingSizeError, setServingSizeError] = useState(false);

  useEffect(() => {
    async function updateUser() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDal = new FirebaseDal(user.uid);
          setDal(userDal);
        }
      });
    }

    updateUser();
  }, []);

  const goHome = () => {
    router.push(routes.home);
  };

  const handleAddFood = async () => {
    if (foodRef.current.foodItem.name.length > 0) {
      const dalRef = dal as FirebaseDal;
      const foodData = await dalRef.getFood(foodRef.current.foodItem.name);

      if (foodData) {
        setFoodFound(true);
        setShowAddForm(false);
        setFetchedFoodData(foodData);
        foodRef.current.foodItem = foodData;
      } else {
        setShowAddForm(true);
      }
    } else {
      foodRef.current.nameError = true;
    }
  };

  const handleAddFoodToUser = async () => {
    const dalRef = dal as FirebaseDal;

    const totals: FoodItem = {
      name: (fetchedFoodData as FoodItem).name,
      nutrition: {
        calories,
        fat,
        carbs,
        protein,
      },
    };

    await dalRef.addFoodToUser(totals);
    goHome();
  };

  const handleNameUpdate = (name: string) => {
    const error = name === "";
    if (error) {
      foodRef.current.nameError = error;
    }

    foodRef.current.foodItem.name = name;
  };

  const handleFoodUpdate = (dispatch: DispatchStrings, dataString: string) => {
    let data: number = 0;
    try {
      data = Number(dataString);
    } catch (e: any) {
      switch (dispatch) {
        case DispatchStrings.servingSize:
          foodRef.current.servingError = true;
          break;
        case DispatchStrings.calorie:
          foodRef.current.calorieError = true;
          break;
        case DispatchStrings.fat:
          foodRef.current.fatError = true;
          break;
        case DispatchStrings.carbs:
          foodRef.current.carbError = true;
          break;
        case DispatchStrings.protein:
          foodRef.current.proteinError = true;
          break;
      }
    }
    const error = data < 0;
    if (error) {
      switch (dispatch) {
        case DispatchStrings.servingSize:
          foodRef.current.servingError = true;
          break;
        case DispatchStrings.calorie:
          foodRef.current.calorieError = true;
          break;
        case DispatchStrings.fat:
          foodRef.current.fatError = true;
          break;
        case DispatchStrings.carbs:
          foodRef.current.carbError = true;
          break;
        case DispatchStrings.protein:
          foodRef.current.proteinError = true;
          break;
      }
    }
    switch (dispatch) {
      case DispatchStrings.servingSize:
        foodRef.current.foodItem.nutrition.servingSize = data;
        break;
      case DispatchStrings.calorie:
        foodRef.current.foodItem.nutrition.calories = data;
        break;
      case DispatchStrings.fat:
        foodRef.current.foodItem.nutrition.fat = data;
        break;
      case DispatchStrings.carbs:
        foodRef.current.foodItem.nutrition.carbs = data;
        break;
      case DispatchStrings.protein:
        foodRef.current.foodItem.nutrition.protein = data;
        break;
    }
  };

  const handleServingSizeUpdate = (servingSizeString: string) => {
    const foodData = fetchedFoodData as FoodItem;
    let servingSize = 0;
    try {
      servingSize = Number(servingSizeString);
    } catch (e: any) {
      setServingSizeError(true);
    }

    setServingSizeError(servingSize < 0);

    const getMacroValue = (serving: number, normalizedValue: number) => {
      const macro = calculateMacroFromNormalizedValue(serving, normalizedValue);
      return roundToHundreths(macro);
    };

    setCalories(
      getMacroValue(servingSize, Number(foodData.nutrition.calsPerHundredGrams))
    );
    setFat(
      getMacroValue(servingSize, Number(foodData.nutrition.fatPerHundredGrams))
    );
    setCarbs(
      getMacroValue(
        servingSize,
        Number(foodData.nutrition.carbsPerHundredGrams)
      )
    );
    setProtein(
      getMacroValue(
        servingSize,
        Number(foodData.nutrition.proteinPerHundredGrams)
      )
    );
  };

  const handleAddFoodToDb = async (e: any) => {
    e.preventDefault();

    const dalRef = dal as FirebaseDal;
    await dalRef.addFood(foodRef.current.foodItem);
    handleAddFood();
  };

  const handleFoodFormSubmit = async (e: any) => {
    e.preventDefault();

    if (foodFound) {
      console.log("calling user");
      await handleAddFoodToUser();
    } else {
      console.log("calling food");
      await handleAddFood();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main style={styles.root}>
        <h1 style={styles.foodTitle}>Add Food</h1>
        <form autoComplete="off" onSubmit={handleFoodFormSubmit}>
          <ColoredTextField
            id="food-add-name"
            required
            label="Food Name"
            variant="outlined"
            focused
            style={styles.foodTextField}
            onChange={(e) => handleNameUpdate(e.target.value)}
            error={foodRef.current.nameError}
          />
          {showAddForm ? (
            <AddFoodForm
              handleTextUpdate={handleFoodUpdate}
              foodRef={foodRef}
            />
          ) : (
            <></>
          )}
          {foodFound ? (
            <>
              <ColoredTextField
                id="food-confirm-serving"
                required
                label="Your serving size"
                variant="outlined"
                focused
                style={styles.foodTextField}
                onChange={(e) => handleServingSizeUpdate(e.target.value)}
                error={servingSizeError}
              />
              <ConfirmFoodForm
                foodData={fetchedFoodData}
                displayData={{ calories, fat, carbs, protein }}
              />
            </>
          ) : (
            <></>
          )}
          <div style={styles.foodButtons}>
            {foodFound ? (
              <></>
            ) : (
              <>
                <NutritionButton type="submit">Search</NutritionButton>
                {showAddForm ? (
                  <NutritionButton onClick={handleAddFoodToDb}>
                    Add Food to Database
                  </NutritionButton>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </form>
      </main>
    </ThemeProvider>
  );
}
