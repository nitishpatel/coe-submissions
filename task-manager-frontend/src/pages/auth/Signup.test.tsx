import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Signup from "./Signup";
import { authService } from "../../services/authService";

vi.mock("../../services/authService", () => ({
  authService: {
    register: vi.fn(),
  },
}));

describe("Signup Page", () => {
  let unmountSignup: () => void;
  beforeEach(() => {
    const { unmount } = render(<Signup />);
    unmountSignup = unmount;
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
      expect(
        await screen.findByText(/Confirm password is mandatory/i)
      ).toBeInTheDocument(); // confirmPassword missing
    });
  });
  describe("Signup form integration", () => {
    it("calls authService.register with form data", async () => {
      unmountSignup();
      const mockRegister = vi.mocked(authService.register);
      mockRegister.mockResolvedValueOnce({
        id: "1f606822-ef78-47ab-9116-6e3dfaa935a9",
        email: "test@example.in",
        full_name: null,
        is_active: true,
        created_at: "2025-09-03T11:56:20.713998",
        updated_at: "2025-09-03T11:56:20.713998",
      });
      render(<Signup />);
      fireEvent.input(screen.getByPlaceholderText(/email/i), {
        target: { value: "test@example.in" },
      });
      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: "Test@123" },
      });
      fireEvent.input(screen.getByLabelText(/confirm password/i), {
        target: { value: "Test@123" },
      });

      await fireEvent.click(screen.getByRole("button", { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            email: "test@example.in",
            password: "Test@123",
            confirmPassword: "Test@123",
          })
        );
      });
    });
  });
});
