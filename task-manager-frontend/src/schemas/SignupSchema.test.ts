import { email } from "zod";
import { signupSchema } from "./SignupSchema";

const validBaseUser = {
  email: "test@example.in",
  password: "Test@123",
  confirmPassword:"Test@123"
};

describe("Signup schema", () => {
  it("fails if email is missing", () => {
    const result = signupSchema.safeParse({
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
    const result = signupSchema.safeParse({
      email: validBaseUser.email,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password"],
            message: "Password is mandatory",
          }),
        ])
      );
    }
  });

  it("should not fail if full name is missing", () => {
    const result = signupSchema.safeParse(validBaseUser);
    expect(result.success).toBe(true);
  });

  it("allows a full name", () => {
    const result = signupSchema.safeParse({
      ...validBaseUser,
      fullName: "Test User",
    });
    expect(result.success).toBe(true);
  });

  it("fails if confirm password is missing", () => {
    const result = signupSchema.safeParse({
      email:validBaseUser.email,
      password:validBaseUser.password
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["confirmPassword"],
            message: "Confirm Password is mandatory",
          }),
        ])
      );
    }
  });
});
