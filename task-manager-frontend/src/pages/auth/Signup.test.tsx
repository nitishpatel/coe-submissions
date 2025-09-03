import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Signup Page", () => {
  beforeEach(()=>{
    render(<Signup/>);
  });
  it("renders the signup page heading", () => {
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
  it("should have an form",()=>{
    expect(screen.getByRole("form",{
      name:"signup-form"
    }))
  })
  it("form should have an email id input field",()=>{
    expect(screen.getByRole("textbox",{name:/email/i})).toBeInTheDocument();
  })
  it("form should have an full name field",()=>{
    expect(screen.getByRole("textbox",{name:/Full Name/i})).toBeInTheDocument();
  })
  it("form should have an password field",()=>{
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");
  })
  it("form should have an password field",()=>{
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute("type", "password");
  })
});