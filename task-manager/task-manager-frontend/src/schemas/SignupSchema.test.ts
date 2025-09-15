import { email } from "zod";
import { signupSchema } from "./SignupSchema";

const validBaseUser = {
  email: "test@example.in",
  password: "Test@123",
  confirmPassword: "Test@123"
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
      email: validBaseUser.email,
      password: validBaseUser.password
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


  describe("password schema validations", () => {
    it("fails if password is shorter than 8 characters", () => {
      const result = signupSchema.safeParse({
        ...validBaseUser,
        password: "short1",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["password"],
              message: "Password must be between 8 and 26 characters",
            }),
          ])
        );
      }
    });
    it("fails if password is greater than 26 characters", () => {
      const result = signupSchema.safeParse({
        ...validBaseUser,
        password: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["password"],
              message: "Password must be between 8 and 26 characters",
            }),
          ])
        );
      }
    });
  });

  it("should fail if confirm password and password does not match", () => {
    const result = signupSchema.safeParse({
      email:validBaseUser.email,
      password: validBaseUser.password,
      confirmPassword: "someotherpassword",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["confirmPassword"],
            message: "Password do not match",
          }),
        ])
      );
    }
  })
});
