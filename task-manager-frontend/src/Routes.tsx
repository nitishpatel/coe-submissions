import type { RouteObject } from "react-router";
import Signup from "./pages/auth/Signup";

export const routes:RouteObject[] = [
  {
    "path":"/register",
    "element":<Signup/>
  }
];