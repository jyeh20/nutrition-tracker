"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColoredTextField } from "@/components/ColoredTextField";
import { darkTheme } from "@/components/Theme";
import { useState } from "react";
import "../auth.css";
import { AuthButton } from "@/components/AuthComponents";
import AccountDal from "@/data-access/account";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const routeHome = () => {
    router.push(routes.home);
  };

  const goSignUp = () => {
    router.push(routes.signup);
  };

  const handleSubmit = async (e: any) => {
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
        const userCredential =
          await AccountDal.prototype.signInUserWithEmailPassword(
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
      <form className="auth-form-control" onSubmit={handleSubmit}>
        <h2 className="auth-header">Sign In</h2>
        <ColoredTextField
          id="sign-up-email"
          required
          label="Email"
          variant="outlined"
          focused
          className="auth-text-field"
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
          className="auth-text-field"
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <AuthButton type="submit" className="auth-button">
          Submit
        </AuthButton>
        <AuthButton className="auth-button" onClick={goSignUp}>
          Sign Up
        </AuthButton>
      </form>
    </ThemeProvider>
  );
}
