import { loginResponseMock } from "../mocks/loginResponse.mock";
import { useAuthStore } from "./authStore";


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
    authStore.loginSuccess(loginResponseMock);
    const updatedAuthStore = useAuthStore.getState();
    expect(updatedAuthStore.isAuthenticated).toBe(true);
    expect(updatedAuthStore.user).toBe(loginResponseMock.user);
    expect(updatedAuthStore.token).toBe(loginResponseMock.access_token);
  });
  it("should reset the state on logout", () => {
    const authStore = useAuthStore.getState();
    authStore.loginSuccess(loginResponseMock);
    const updatedAuthStore = useAuthStore.getState();
    expect(updatedAuthStore.isAuthenticated).toBe(true);
    expect(updatedAuthStore.user).toBe(loginResponseMock.user);
    expect(updatedAuthStore.token).toBe(loginResponseMock.access_token);
    authStore.logout();
    const updatedAuthStore2 = useAuthStore.getState();
    expect(updatedAuthStore2.user).toBe(null);
    expect(updatedAuthStore2.token).toBe(null);
  });
})