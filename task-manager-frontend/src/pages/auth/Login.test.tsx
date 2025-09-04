import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { authService } from "../../services/authService";

vi.mock("../../services/authService", () => ({
  authService: {
    login: vi.fn(),
  },
}));

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
  describe("Signup form integration", () => {
    it("calls authService.register with form data", async () => {
      unmountlogin();
      const mockLogin = vi.mocked(authService.login);
      mockRegister.mockResolvedValueOnce({
        access_token:
          "dummy_jwt_token",
        token_type: "bearer",
        user: {
          id: "2bab6bc1-b938-4867-99f4-3761db08d8b9",
          email: "test@example.com",
          full_name: null,
          is_active: true,
          created_at: "2025-08-29T11:11:49.382281",
          updated_at: "2025-08-29T11:11:49.382281",
        },
      });
      render(<Login />);
      fireEvent.input(screen.getByPlaceholderText(/email/i), {
        target: { value: "test@example.in" },
      });
      fireEvent.input(screen.getByLabelText(/^password$/i), {
        target: { value: "Test@123" },
      });

      await fireEvent.click(screen.getByRole("button", { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          expect.objectContaining({
            email: "test@example.in",
            password: "Test@123",
          })
        );
      });
    });
  });
});
