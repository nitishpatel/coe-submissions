import { fireEvent, render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Signup Page", () => {
  beforeEach(() => {
    render(<Signup />);
  });
  it("renders the signup page heading", () => {
    expect(screen.getByText(/register for taskplusplus/i)).toBeInTheDocument();
  });
  it("should have an form", () => {
    expect(
      screen.getByRole("form", {
        name: "signup-form",
      })
    );
  });
  it("form should have an email id input field", () => {
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });
  it("form should have an full name field", () => {
    expect(
      screen.getByRole("textbox", { name: /Full Name/i })
    ).toBeInTheDocument();
  });
  it("form should have an password field", () => {
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("form should have an confirm password field", () => {
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("form should have an register button", () => {
    expect(
      screen.getByRole("button", {
        name: /Register/i,
      })
    ).toBeVisible();
  });
  describe("Signup form on submit validations", () => {
    it("shows error messages when submitting an empty form", async () => {
      await fireEvent.click(screen.getByRole("button", { name: /register/i }));
      expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
      expect(
        await screen.findByText(/Password must be between 8 and 26 characters/i)
      ).toBeInTheDocument();
      expect(await screen.findByText(/Confirm password is mandatory/i)).toBeInTheDocument(); // confirmPassword missing
    });
  });
});
