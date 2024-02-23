"use client";
import { CssBaseline, FormControl, ThemeProvider } from "@mui/material";
import { ColoredTextField } from "@/components/ColoredTextField";
import { darkTheme } from "@/components/Theme";
import { useState } from "react";
import "../auth.css";
import { AuthButton } from "@/components/AuthComponents";
import { Account } from "@/data-access";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const routeHome = () => {
    router.push(routes.home);
  };

  const goSignIn = () => {
    router.push(routes.signin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting", name, email, password);

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
        await Account.prototype.createUserWithEmailPassword(
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
      <form className="auth-form-control" onSubmit={handleSubmit}>
        <h2 className="auth-header">Sign Up</h2>
        <ColoredTextField
          id="sign-up-name"
          required
          label="Name"
          variant="outlined"
          focused
          className="auth-text-field"
          onChange={(e) => setName(e.target.value)}
          error={nameError}
        />
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
        <AuthButton className="auth-button" onClick={goSignIn}>
          Sign in
        </AuthButton>
      </form>
    </ThemeProvider>
  );
}
