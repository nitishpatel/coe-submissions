import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home component", () => {
  let unmountHome:()=>void;

  const simulateIncrementButtonClick = () => {
    fireEvent.click(screen.getByRole("button",{name:/increment/i}));
  };


  beforeEach(()=>{
    localStorage.clear();
    const {unmount} = render(<Home/>);
    unmountHome = unmount;
  });
  it("renders the home page heading", () => {
    expect(screen.getByText(/Counter Home Page/i)).toBeInTheDocument();
  });

  it("should have an increment button",()=>{
    expect(screen.getByRole("button",{name:/increment/i})).toBeInTheDocument();
  })

  it("should have an counter text",()=>{
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
  })

  it("on click of increment button counter text should increase by 1",()=>{
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
    simulateIncrementButtonClick();
    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
  });

  it("on reload should load state from localStorage",()=>{
    localStorage.setItem("counter","10");
    render(<Home/>);
    expect(screen.getByText(/Counter : 10/i)).toBeInTheDocument();
  });

  it("should save the counter state in the localStorage",()=>{
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();

    simulateIncrementButtonClick();

    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
    unmountHome();
    render(<Home/>);
    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
  });
});
