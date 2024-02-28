"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";

import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import FirebaseDal from "@/data-access/firebaseInterface";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMainStyles from "./style";
import { darkTheme } from "@/components/Theme";

import { dbCalorieTrackerToRegularTracker, sameDay } from "@/utils/utils";
import { NutritionButton } from "@/components/Components";

import { DocumentData, Timestamp } from "firebase/firestore";
import { CalorieTracker } from "@/models/Food";

export default function Home() {
  const router = useRouter();
  const [dal, setDal] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [calorieInfo, setCalorieInfo] = useState({});
  const styles = useMainStyles(darkTheme);

  const goSignIn = () => {
    router.push(routes.signin);
  };

  const goAddFood = () => {
    router.push(routes.addFood);
  };

  useEffect(() => {
    async function updateUser() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const newDal = new FirebaseDal(user.uid);
          setUserInfo(await newDal.getUserData());
          setCalorieInfo(await newDal.getCalorieData());
          setDal(newDal);
        } else {
          goSignIn();
        }
      });
    }

    updateUser();
  }, []);

  const MainDisplay = () => {
    const getCalories = (calorieArray: any[]): CalorieTracker => {
      let latest = calorieArray[calorieArray.length - 1];
      if (latest.date instanceof Timestamp) {
        latest = dbCalorieTrackerToRegularTracker(latest);
      }
      const latestDate = latest.date;

      const today = new Date(Date.now());

      if (sameDay(today, latestDate)) {
        return latest;
      }

      const dalCast = dal as FirebaseDal;

      return dalCast.addCalorieTracker(calorieArray);
    };

    if (
      Object.keys(userInfo).length === 0 ||
      Object.keys(calorieInfo).length === 0
    ) {
      return <div>Loading</div>;
    } else {
      const userDisplayInfo = userInfo as DocumentData;
      const calorieDisplayInfo = calorieInfo as DocumentData;
      const calories = getCalories(calorieDisplayInfo.calorieList);
      return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <div style={styles.userInfo}>
            <h2>Welcome back {userDisplayInfo.name}</h2>
            <div style={styles.tracker}>
              <h3>Calories: {calories.totalCalories}</h3>
              <h3>Total Fat: {calories.totalFats}</h3>
              <h3>Total Carbs: {calories.totalCarbs}</h3>
              <h3>Total Protein: {calories.totalProtein}</h3>
            </div>
          </div>
          <div style={styles.inputs}>
            <NutritionButton onClick={goAddFood}>Add Food</NutritionButton>
          </div>
        </ThemeProvider>
      );
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main style={styles.root}>
        <MainDisplay />
      </main>
    </ThemeProvider>
  );
}
