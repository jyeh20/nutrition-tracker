import { Theme } from "@mui/material/styles";

const useMealStyles = (theme: Theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "rgb(10,10,10)",
  },

  foodTitle: {
    marginTop: "10vh",
    marginBottom: "5vh",
  },

  foodTextField: {
    marginTop: "3vh",
  },

  foodButtons: {
    paddingTop: "3vh",
    margin: "0px auto",
    display: "flex",
    flex: "1",
    flexDirection: "column" as "column",
    alignItems: "center",
  },

  foodMacroInfo: {
    paddingTop: "3vh",
    // spaceBetween: "0.5vh",
  },

  foodConfirmButton: {
    marginTop: "3vh",
  },
});

export default useMealStyles;
