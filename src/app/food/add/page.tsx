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
import { calculateMacroFromNormalizedValue } from "@/utils/utils";
import { AppProps } from "next/app";

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

enum DISPATCH_STRINGS {
  servingSize,
  calorie,
  fat,
  carbs,
  protein,
}

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
  const [showForm, setShowForm] = useState(false);
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
        setFetchedFoodData(foodData);
        foodRef.current.foodItem = foodData;
      } else {
        setShowForm(true);
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

  const handleFoodUpdate = (dispatch: DISPATCH_STRINGS, dataString: string) => {
    let data: number = 0;
    try {
      data = Number(dataString);
    } catch (e: any) {
      switch (dispatch) {
        case DISPATCH_STRINGS.servingSize:
          foodRef.current.servingError = true;
          break;
        case DISPATCH_STRINGS.calorie:
          foodRef.current.calorieError = true;
          break;
        case DISPATCH_STRINGS.fat:
          foodRef.current.fatError = true;
          break;
        case DISPATCH_STRINGS.carbs:
          foodRef.current.carbError = true;
          break;
        case DISPATCH_STRINGS.protein:
          foodRef.current.proteinError = true;
          break;
      }
    }
    const error = data < 0;
    if (error) {
      switch (dispatch) {
        case DISPATCH_STRINGS.servingSize:
          foodRef.current.servingError = true;
          break;
        case DISPATCH_STRINGS.calorie:
          foodRef.current.calorieError = true;
          break;
        case DISPATCH_STRINGS.fat:
          foodRef.current.fatError = true;
          break;
        case DISPATCH_STRINGS.carbs:
          foodRef.current.carbError = true;
          break;
        case DISPATCH_STRINGS.protein:
          foodRef.current.proteinError = true;
          break;
      }
    }
    switch (dispatch) {
      case DISPATCH_STRINGS.servingSize:
        foodRef.current.foodItem.nutrition.servingSize = data;
        break;
      case DISPATCH_STRINGS.calorie:
        foodRef.current.foodItem.nutrition.calories = data;
        break;
      case DISPATCH_STRINGS.fat:
        foodRef.current.foodItem.nutrition.fat = data;
        break;
      case DISPATCH_STRINGS.carbs:
        foodRef.current.foodItem.nutrition.carbs = data;
        break;
      case DISPATCH_STRINGS.protein:
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
      return Math.round((macro + Number.EPSILON) * 100) / 100;
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

  const AddFoodForm = () => {
    return (
      <div>
        <ColoredTextField
          id="food-add-serving-size"
          required
          defaultValue={0}
          label="Serving Size (g/mL/oz/etc)"
          variant="outlined"
          focused
          style={styles.foodTextField}
          onChange={(e) =>
            handleFoodUpdate(DISPATCH_STRINGS.servingSize, e.target.value)
          }
          error={foodRef.current.servingError}
        />
        <ColoredTextField
          id="food-add-calories"
          required
          defaultValue={0}
          label="Calories"
          variant="outlined"
          focused
          style={styles.foodTextField}
          onChange={(e) =>
            handleFoodUpdate(DISPATCH_STRINGS.calorie, e.target.value)
          }
          error={foodRef.current.calorieError}
        />
        <ColoredTextField
          id="food-add-fat"
          required
          defaultValue={0}
          label="Fat"
          variant="outlined"
          focused
          style={styles.foodTextField}
          onChange={(e) =>
            handleFoodUpdate(DISPATCH_STRINGS.fat, e.target.value)
          }
          error={foodRef.current.fatError}
        />
        <ColoredTextField
          id="food-add-carbs"
          required
          defaultValue={0}
          label="Carbs"
          variant="outlined"
          focused
          style={styles.foodTextField}
          onChange={(e) =>
            handleFoodUpdate(DISPATCH_STRINGS.carbs, e.target.value)
          }
          error={foodRef.current.carbError}
        />
        <ColoredTextField
          id="food-add-protein"
          required
          defaultValue={0}
          label="Protein"
          variant="outlined"
          focused
          style={styles.foodTextField}
          onChange={(e) =>
            handleFoodUpdate(DISPATCH_STRINGS.protein, e.target.value)
          }
          error={foodRef.current.proteinError}
        />
      </div>
    );
  };

  const ConfirmFoodForm = () => {
    if (Object.keys(fetchedFoodData).length === 0) {
      return <div>Loading</div>;
    } else {
      return (
        <div>
          <div style={styles.foodMacroInfo}>
            <h3>Calories: {calories}</h3>
            <h3>Fat: {fat}</h3>
            <h3>Carbs: {carbs}</h3>
            <h3>Protein: {protein}</h3>
          </div>
          <NutritionButton sx={styles.foodConfirmButton} type="submit">
            Confirm?
          </NutritionButton>
        </div>
      );
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
          {showForm ? <AddFoodForm /> : <></>}
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
              <ConfirmFoodForm />
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
                {showForm ? (
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
