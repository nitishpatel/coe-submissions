import { email } from "zod";
import { loginSchema } from "./LoginSchema";

const validBaseUser = {
  email: "test@example.in",
  password: "Test@123",
};

describe("Login schema", () => {
  it("fails if email is missing", () => {
    const result = loginSchema.safeParse({
      password: validBaseUser.password,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["email"],
            message: "Invalid email",
          }),
        ])
      );
    }
  });
  it("fails if email is invalid", () => {
    const result = loginSchema.safeParse({
      email:"test",
      password: validBaseUser.password,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["email"],
            message: "Invalid email",
          }),
        ])
      );
    }
  });
});
