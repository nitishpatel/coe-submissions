import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>
);
