import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";

function LoginProbe() {
  return <div>Login Page</div>;
}
function DashProbe() {
  return <div>Dashboard Page</div>;
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    // start tests unauthenticated
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<DashProbe />} />
          </Route>
          <Route path="/login" element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
