import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Hero from "./pages/Hero";
import MainLayout from "./layout/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/counter"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/"
          element={
            <MainLayout>
              <Hero />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
