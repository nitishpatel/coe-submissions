import { fireEvent, render, screen } from "@testing-library/react";
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

  it("on click of increment button counter text should increase by 1",()=>{
    render(<Home/>);
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{
      name:/increment/i
    }))
    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
  });

  it("on reload should load state from localStorage",()=>{
    localStorage.setItem("counter","10");
    expect(screen.getByText(/Counter : 10/i)).toBeInTheDocument();
  });
});
