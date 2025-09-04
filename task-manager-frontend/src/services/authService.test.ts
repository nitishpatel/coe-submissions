import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import type { LoginResponse, User } from "../types/user";

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

const mockUser: User = {
  id: "1f606822-ef78-47ab-9116-6e3dfaa935a9",
  email: "test@example.in",
  full_name: null,
  is_active: true,
  created_at: "2025-09-03T11:56:20.713998",
  updated_at: "2025-09-03T11:56:20.713998",
};

const mockLoginResponse: LoginResponse = {
  "access_token": "dummy_jwt_token",
  "token_type": "bearer",
  "user": mockUser
};

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

    hoisted.axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

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
    expect(result).toEqual(mockUser);
  });
  it("returns a user object on successful login", async () => {
    hoisted.axiosInstance.post.mockResolvedValueOnce({ data: mockLoginResponse });

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
    expect(result).toEqual(mockLoginResponse);
  });
});
