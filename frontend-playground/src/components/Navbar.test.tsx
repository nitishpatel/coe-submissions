import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, type MemoryHistory } from "history";
import Hero from "../pages/Hero";
import { Router } from "react-router";
import Navbar from "./Navbar";

describe("Navbar", () => {
  let history: MemoryHistory;
  beforeEach(() => {
    localStorage.clear();
    history = createMemoryHistory({ initialEntries: ["/counter"] });
    render(
      <Router location={history.location} navigator={history}>
        <Navbar />
      </Router>
    );
  });
  it("should have the project title", () => {
    expect(screen.getByText(/CountPlusPlus/i)).toBeVisible();
  });

  it("should navigate to / on click of Navbar Button", () => {
    expect(history.location.pathname).toBe("/counter");
    fireEvent.click(screen.getByText(/CountPlusPlus/i));
    expect(history.location.pathname).toBe("/");
  });
});
