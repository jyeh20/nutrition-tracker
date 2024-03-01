import { Theme } from "@mui/material/styles";

const useMainStyles = (theme: Theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "rgb(10,10,10)",
  },

  userInfo: {
    paddingTop: "15vh",
  },

  tracker: {
    marginTop: "3vh",
  },

  inputs: {
    marginTop: "3vh",
  },
});

export default useMainStyles;
