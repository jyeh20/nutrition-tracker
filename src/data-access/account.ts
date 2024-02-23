import { doc, setDoc } from "firebase/firestore";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase";

export class Account {
  generateEmptyAccount(name: string, id: string): AccountDescription {
    const emptyCalorie: CalorieTracker = {
      date: new Date(Date.now()),
      totalCalories: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalProtein: 0,
      foods: [],
    };
    const emptyAccount: AccountDescription = {
      name,
      id,
      calories: [emptyCalorie],
    };

    return emptyAccount;
  }

  async createUserWithEmailPassword(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userId = userCredential.user.uid;
    const accountRef = doc(db, "users", userId);
    setDoc(accountRef, this.generateEmptyAccount(name, userId));

    return userCredential.user;
  }

  async signInUserWithEmailPassword(
    email: string,
    password: string
  ): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  }
}
