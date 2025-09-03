import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Signup Page", () => {
  beforeEach(()=>{
    render(<Signup/>);
  });
  it("renders the signup page heading", () => {
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
});