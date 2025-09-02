import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home component", () => {
  it("renders the home page heading", () => {
    render(<Home />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
