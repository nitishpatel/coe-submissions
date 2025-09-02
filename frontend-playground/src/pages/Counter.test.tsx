import { fireEvent, render, screen } from "@testing-library/react";
import Counter from "./Counter";

describe("Home component", () => {
  let unmountHome:()=>void;

  const simulateIncrementButtonClick = () => {
    fireEvent.click(screen.getByRole("button",{name:/increment/i}));
  };

  beforeEach(()=>{
    localStorage.clear();
    const {unmount} = render(<Counter/>);
    unmountHome = unmount;
  });
  it("renders the home page heading", () => {
    expect(screen.getByText(/So what you counting?/i)).toBeInTheDocument();
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
    unmountHome();
    localStorage.setItem("counter","10");
    render(<Counter/>);
    expect(screen.getByText(/Counter : 10/i)).toBeInTheDocument();
  });

  it("should save the counter state in the localStorage",()=>{
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();

    simulateIncrementButtonClick();

    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
    unmountHome();
    render(<Counter/>);
    expect(screen.getByText(/Counter : 1/i)).toBeInTheDocument();
  });

  it("should have an reset button",()=>{
    expect(screen.getByRole("button",{
      name:/Reset/i
    })).toBeVisible();
  });

  it("on click of reset button should change the counter to 0",()=>{
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
    simulateIncrementButtonClick();
    simulateIncrementButtonClick();
    expect(screen.getByText(/Counter : 2/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{
      name:/Reset/i
    }));
    expect(screen.getByText(/Counter : 0/i)).toBeInTheDocument();
  })
});
