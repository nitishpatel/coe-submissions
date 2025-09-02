import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home component", () => {
  it("renders the home page heading", () => {
    render(<Home />);
    expect(screen.getByText(/Counter Home Page/i)).toBeInTheDocument();
  });

  it("should have an increment button",()=>{
    render(<Home/>);
    expect(screen.getByRole("button",{name:/increment/i})).toBeInTheDocument();
  })

  it("should have an counter text",()=>{
    render(<Home/>);
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
  })
});
