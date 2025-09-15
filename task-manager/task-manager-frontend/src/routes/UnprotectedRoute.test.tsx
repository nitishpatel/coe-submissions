import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import UnprotectedRoute from "./UnprotectedRoute";
import { useAuthStore } from "../store/authStore";
import { loginResponseMock } from "../mocks/loginResponse.mock";
import ProtectedRoute from "./ProtectedRoute";

function LoginProbe() {
  return <div>Login Page</div>;
}
function DashProbe() {
  return <div>Dashboard Page</div>;
}

describe("UnProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("redirects authenticated users to dashboard", () => {
    const authStore = useAuthStore.getState();
    authStore.loginSuccess(loginResponseMock);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<DashProbe />} />
          </Route>
          <Route element={<UnprotectedRoute redirectTo="/dashboard"/>}>
            <Route path="/login" element={<LoginProbe />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
  it("does not redirect authenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<DashProbe />} />
          </Route>
          <Route element={<UnprotectedRoute redirectTo="/dashboard"/>}>
            <Route path="/login" element={<LoginProbe />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login page/i)).toBeInTheDocument();
  });
});
