import { ColoredTextField } from "@/components/ColoredTextField";
import { AddFoodFormProps } from "@/models/Food";
import useFoodStyles from "../style";
import { darkTheme } from "@/components/Theme";
import { DispatchStrings } from "../enums";

const AddFoodForm = ({ handleTextUpdate, foodRef }: AddFoodFormProps) => {
  const styles = useFoodStyles(darkTheme);

  return (
    <div>
      <ColoredTextField
        id="food-add-serving-size"
        type="number"
        required
        defaultValue={0}
        label="Serving Size (g/mL/oz/etc)"
        variant="outlined"
        focused
        style={styles.foodTextField}
        onChange={(e) =>
          handleTextUpdate(DispatchStrings.servingSize, e.target.value)
        }
        error={foodRef.current.servingError}
      />
      <ColoredTextField
        id="food-add-calories"
        type="number"
        required
        defaultValue={0}
        label="Calories"
        variant="outlined"
        focused
        style={styles.foodTextField}
        onChange={(e) =>
          handleTextUpdate(DispatchStrings.calorie, e.target.value)
        }
        error={foodRef.current.calorieError}
      />
      <ColoredTextField
        id="food-add-fat"
        type="number"
        required
        defaultValue={0}
        label="Fat"
        variant="outlined"
        focused
        style={styles.foodTextField}
        onChange={(e) => handleTextUpdate(DispatchStrings.fat, e.target.value)}
        error={foodRef.current.fatError}
      />
      <ColoredTextField
        id="food-add-carbs"
        type="number"
        required
        defaultValue={0}
        label="Carbs"
        variant="outlined"
        focused
        style={styles.foodTextField}
        onChange={(e) =>
          handleTextUpdate(DispatchStrings.carbs, e.target.value)
        }
        error={foodRef.current.carbError}
      />
      <ColoredTextField
        id="food-add-protein"
        type="number"
        required
        defaultValue={0}
        label="Protein"
        variant="outlined"
        focused
        style={styles.foodTextField}
        onChange={(e) =>
          handleTextUpdate(DispatchStrings.protein, e.target.value)
        }
        error={foodRef.current.proteinError}
      />
    </div>
  );
};

export default AddFoodForm;
