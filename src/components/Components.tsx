import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const NutritionButton = styled(Button)<ButtonProps>(({ theme }) => ({
  height: "5vh",
  color: "#eeeeee",
  backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#ACD4FF",
}));
