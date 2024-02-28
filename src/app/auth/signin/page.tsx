"use client";
import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const styles = useAuthStyles(darkTheme);

  const routeHome = () => {
    router.replace(routes.home);
  };

  const goSignUp = () => {
    router.replace(routes.signup);
  };

  const handleSubmit = async (e: any) => {
    console.log("Signing in");
    e.preventDefault();

    let error = false;

    if (!email) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
      error = false;
    }
    if (!password) {
      setPasswordError(true);
      error = true;
    } else {
      setPasswordError(false);
      error = false;
    }

    if (!error) {
      try {
        console.log(`Logging in user with email ${email}`);
        const userCredential =
          await FirebaseDal.prototype.signInUserWithEmailPassword(
            email,
            password
          );
        if (userCredential) {
          routeHome();
        }
      } catch (e) {
        window.alert("Something went wrong, please try again");
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={styles.root}>
        <form style={styles.authFormControl} onSubmit={handleSubmit}>
          <h2 style={styles.authHeader}>Sign In</h2>
          <ColoredTextField
            id="sign-up-email"
            required
            label="Email"
            variant="outlined"
            focused
            sx={styles.authTextField}
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
            sx={styles.authTextField}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />

          <NutritionButton type="submit" sx={styles.NutritionButton}>
            Submit
          </NutritionButton>
        </form>
        <NutritionButton sx={styles.NutritionButton} onClick={goSignUp}>
          Sign Up
        </NutritionButton>
      </Box>
    </ThemeProvider>
  );
}
