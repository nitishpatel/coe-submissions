import type { RouteObject } from "react-router";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

export const routes:RouteObject[] = [
  {
    "path":"/register",
    "element":<Signup/>
  },
  {
    "path":"/login",
    element:<Login/>
  }
];