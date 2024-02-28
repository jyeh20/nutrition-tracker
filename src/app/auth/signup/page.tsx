"use client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ColoredTextField } from "@/components/ColoredTextField";
import { darkTheme } from "@/components/Theme";
import { useState } from "react";
import { NutritionButton } from "@/components/Components";
import FirebaseDal from "@/data-access/firebaseInterface";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";
import useAuthStyles from "../style";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const styles = useAuthStyles(darkTheme);

  const routeHome = () => {
    router.replace(routes.home);
  };

  const goSignIn = () => {
    router.replace(routes.signin);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let error = false;

    if (!name) {
      setNameError(true);
      error = true;
    } else {
      setNameError(false);
      error = false;
    }
    if (!email) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
      error = false;
    }
    if (!password || password.length < 6) {
      setPasswordError(true);
      error = true;
      window.alert("Password must be at least 6 characters");
    } else {
      setPasswordError(false);
      error = false;
    }

    if (!error) {
      const userCredential =
        await FirebaseDal.prototype.createUserWithEmailPassword(
          name,
          email,
          password
        );
      if (userCredential) {
        routeHome();
      } else {
        window.alert("Something went wrong, please try again");
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={styles.root}>
        <form style={styles.authFormControl} onSubmit={handleSubmit}>
          <h2 style={styles.authHeader}>Sign Up</h2>
          <ColoredTextField
            id="sign-up-name"
            required
            label="Name"
            variant="outlined"
            focused
            style={styles.authTextField}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
          />
          <ColoredTextField
            id="sign-up-email"
            required
            label="Email"
            variant="outlined"
            focused
            style={styles.authTextField}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <ColoredTextField
            id="sign-up-password"
            type="password"
            required
            label="Password"
            variant="outlined"
            focused
            style={styles.authTextField}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />
          <NutritionButton type="submit" style={styles.NutritionButton}>
            Submit
          </NutritionButton>
          <NutritionButton style={styles.NutritionButton} onClick={goSignIn}>
            Sign in
          </NutritionButton>
        </form>
      </Box>
    </ThemeProvider>
  );
}
