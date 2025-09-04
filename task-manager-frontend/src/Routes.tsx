import type { RouteObject } from "react-router";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import TaskList from "./pages/task/TaskList";
import UnprotectedRoute from "./routes/UnprotectedRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <UnprotectedRoute />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/task-list",
        element: <TaskList />,
      },
    ],
  },
];
