import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
export const ColoredTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    width: 300,
    color: "#eeeeee",
    backgroundColor:
      theme.palette.mode === "light" ? "#F3F6F9" : "rgb(1,65,255, 0)",
  })
);
