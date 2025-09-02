import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Counter from "./pages/Counter";
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
              <Counter />
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
