"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "@/components/Theme";
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({});

  const goSignIn = () => {
    router.push(routes.signin);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        goSignIn();
      }
    });
  }, []);

  console.log(user);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main className={styles.main}>
        <div className={styles.description}></div>
      </main>
    </ThemeProvider>
  );
}
