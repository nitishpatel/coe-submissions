import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import { loginResponseMock } from "../mocks/loginResponse.mock";

const hoisted = vi.hoisted(() => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => hoisted.axiosInstance),
    },
  };
});



beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(hoisted.axiosInstance).forEach((v: any) => {
    if (typeof v?.mock?.clear === "function") v.mock.clear();
  });
  hoisted.axiosInstance.interceptors.request.use.mockClear();
  hoisted.axiosInstance.interceptors.response.use.mockClear();
});

describe("authService", () => {
  it("returns a user object on successful signup", async () => {

    hoisted.axiosInstance.post.mockResolvedValueOnce({ data: loginResponseMock.user });

    const result = await authService.register({
      email: "test@example.in",
      password: "Test@123",
      confirmPassword: "Test@123",
    });

    expect(hoisted.axiosInstance.post).toHaveBeenCalledWith(
      "/auth/signup",
      expect.objectContaining({
        email: "test@example.in",
        password: "Test@123",
        confirmPassword: "Test@123",
      }),
      undefined
    );
    expect(result).toEqual(loginResponseMock.user);
  });
  it("returns a user object on successful login", async () => {
    hoisted.axiosInstance.post.mockResolvedValueOnce({ data: loginResponseMock });

    const result = await authService.login({
      email: "test@example.in",
      password: "Test@123",
    });

    expect(hoisted.axiosInstance.post).toHaveBeenCalledWith(
      "/auth/login",
      expect.objectContaining({
        email: "test@example.in",
        password: "Test@123",
      }),
      undefined
    );
    expect(result).toEqual(loginResponseMock);
  });
});
