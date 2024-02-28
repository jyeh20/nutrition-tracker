import { Theme } from "@mui/material/styles";

const useAuthStyles = (theme: Theme) => ({
  root: {
    minHeight: "100vh"    backgroundColor: "rgb(10,10,10)",
,

  authFormControl: {
    margin: "0px auto",
    marginTop: "15vh",
    display: "flex",
    flex: "1",
    flexDirection: "column" as "column",
    alignItems: "center",
  },

  authHeader: {
    marginBottom: "3vh",
  },

  authTextField: {
    margin: "auto",
    marginBottom: "3vh",
  },

  NutritionButton: {
    margin: "auto",
    marginTop: "5vh",
    width: "25vw",
  },
});

export default useAuthStyles;
