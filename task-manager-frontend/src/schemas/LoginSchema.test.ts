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
  it("fails if password is missing", () => {
    const result = loginSchema.safeParse({
      email:validBaseUser.email,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password"],
            message: "Please enter a password",
          }),
        ])
      );
    }
  });
  it("should pass if both email and password are valid", () => {
    const result = loginSchema.safeParse({
      email:validBaseUser.email,
      password:validBaseUser.password
    });

    expect(result.success).toBe(true);

  });
});
