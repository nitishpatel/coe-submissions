import type { LoginResponse } from "../types";
import { useAuthStore } from "./authStore";

const loginResponse: LoginResponse = {
  access_token: "dummy_jwt_token",
  token_type: "bearer",
  user: {
    id: "2bab6bc1-b938-4867-99f4-3761db08d8b9",
    email: "test@example.com",
    full_name: null,
    is_active: true,
    created_at: "2025-08-29T11:11:49.382281",
    updated_at: "2025-08-29T11:11:49.382281",
  },
}
describe("auth store", () => {
  it("should load with an empty state", () => {
    const authStore = useAuthStore.getState();
    expect(authStore.user).toBe(null);
    expect(authStore.token).toBe(null);
  })
  it("isAuthenticated should be set to false initally", () => {
    const authStore = useAuthStore.getState();
    expect(authStore.isAuthenticated).toBe(false);
  });
  it("should set the user when loginSuccess is called", () => {
    const authStore = useAuthStore.getState();
    authStore.loginSuccess(loginResponse);
    const updatedAuthStore = useAuthStore.getState();
    expect(updatedAuthStore.isAuthenticated).toBe(true);
    expect(updatedAuthStore.user).toBe(loginResponse.user);
    expect(updatedAuthStore.token).toBe(loginResponse.access_token);
  });
})