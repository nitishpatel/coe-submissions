import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";



describe("Login Page", () => {
  let unmountlogin: () => void;
  beforeEach(() => {
    const { unmount } = render(<Login />);
    unmountlogin = unmount;
  });
  it("renders the signup page heading", () => {
    expect(screen.getByText(/Login to taskplusplus/i)).toBeInTheDocument();
  });
  it("should have an form", () => {
    expect(
      screen.getByRole("form", {
        name: "login-form",
      })
    );
  });
  it("form should have an email id input field", () => {
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });
  it("form should have an password field", () => {
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("form should have an login button", () => {
    expect(
      screen.getByRole("button", {
        name: /Login/i,
      })
    ).toBeVisible();
  });
  describe("Login form on submit validations", () => {
    it("shows error messages when submitting an empty form", async () => {
      await fireEvent.click(screen.getByRole("button", { name: /login/i }));
      expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
      expect(
        await screen.findByText(/Please enter a password/i)
      ).toBeInTheDocument();
    });
  });
});
