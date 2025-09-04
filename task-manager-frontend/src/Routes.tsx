import type { RouteObject } from "react-router";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import TaskList from "./pages/task/TaskList";

export const routes:RouteObject[] = [
  {
    path:"/register",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/task-list",
    element:<TaskList/>
  }
];