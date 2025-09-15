import type { RouteObject } from "react-router";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import TaskList from "./pages/task/TaskList";
import UnprotectedRoute from "./routes/UnprotectedRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import { taskListLoader } from "./services/taskService";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <UnprotectedRoute />, // layout guard
        children: [
          { index: true, element: <Home /> },
          { path: "signup", element: <Signup /> },
          { path: "login", element: <Login /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />, // layout guard
        children: [
          { path: "task-list", element: <TaskList />,loader:taskListLoader },
        ],
      },
    ],
  },
];
