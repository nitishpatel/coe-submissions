import { fireEvent, render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Router } from "react-router";

describe("Hero Page", () => {
  let history:MemoryHistory;
  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/"] });
    render(
      <Router location={history.location} navigator={history}>
        <Hero />
      </Router>
    );
  });
  it("renders the hero page heading", () => {
    expect(screen.getByText(/The Best Counter in the World/i)).toBeVisible();
  });
  it("renders the subtitle of the page", () => {
    expect(screen.getByText(/Counter for your everyday needs/i)).toBeVisible();
  });
  it("should have a get started button", () => {
    expect(
      screen.getByRole("button", {
        name: /Get Started/i,
      })
    ).toBeVisible();
  });
  it("should navigate to counter page on click of Get Started button", () => {
    expect(history.location.pathname).toBe("/");
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(history.location.pathname).toBe("/counter");
  });
});
