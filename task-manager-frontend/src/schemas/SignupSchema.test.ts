import { signupSchema } from "./SignupSchema";

describe("Signup schema",()=>{
  it("fails if email is missing",()=>{
    const result = signupSchema.safeParse({});
    expect(result.success).toBe(false);
  })
  it("should not fail if full name is missing",()=>{
    const result = signupSchema.safeParse({
      email:"test@example.in"
    });
    expect(result.success).toBe(true);
  });
  it("allows an fullname",()=>{
    const result = signupSchema.safeParse({
      email:"test@example.in",
      fullname:"Test User"
    });
    expect(result.success).toBe(true);
  });
  it("fails if password is missing",()=>{
    const result = signupSchema.safeParse({
      email:"test@example.in"
    });
    expect(result.success).toBe(false);
  });
});