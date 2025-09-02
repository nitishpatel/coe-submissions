import { fireEvent, render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { createMemoryHistory } from "history";
import { Router } from "react-router";

describe("Hero Page", () => {
  let unmountHero: () => void;
  beforeEach(() => {
    const { unmount } = render(<Hero />);
    unmountHero = unmount;
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
    unmountHero();
    const history = createMemoryHistory({ initialEntries: ["/"] });
    render(
      <Router location={history.location} navigator={history}>
        <Hero />
      </Router>
    );
    expect(history.location.pathname).toBe("/");
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(history.location.pathname).toBe("/counter");
  });
});
