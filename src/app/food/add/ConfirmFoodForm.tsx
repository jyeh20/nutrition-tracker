import { NutritionButton } from "@/components/Components";
import useFoodStyles from "../style";
import { darkTheme } from "@/components/Theme";
import { ConfirmFoodFormProps } from "@/models/Food";

const ConfirmFoodForm = ({ foodData, displayData }: ConfirmFoodFormProps) => {
  const styles = useFoodStyles(darkTheme);
  if (Object.keys(foodData).length === 0) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <div style={styles.foodMacroInfo}>
          <h3>Calories: {displayData.calories}</h3>
          <h3>Fat: {displayData.fat}</h3>
          <h3>Carbs: {displayData.carbs}</h3>
          <h3>Protein: {displayData.protein}</h3>
        </div>
        <NutritionButton sx={styles.foodConfirmButton} type="submit">
          Confirm?
        </NutritionButton>
      </div>
    );
  }
};

export default ConfirmFoodForm;
