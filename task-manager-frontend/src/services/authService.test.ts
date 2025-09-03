import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { authService } from "./authService";
import { User } from "../types/user";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};
describe("signupService", () => {
  it("returns a user object on successful signup", async () => {
    const mockUser: User = {
      id: "1f606822-ef78-47ab-9116-6e3dfaa935a9",
      email: "test@example.in",
      full_name: null,
      is_active: true,
      created_at: "2025-09-03T11:56:20.713998",
      updated_at: "2025-09-03T11:56:20.713998",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockUser });

    const result = await authService.register({
      email: "test@example.in",
      password: "Test@123",
      confirmPassword: "Test@123",
    });

    expect(result).toEqual(mockUser);
    expect(result.is_active).toBe(true);
    expect(result.full_name).toBeNull();
  });
});
