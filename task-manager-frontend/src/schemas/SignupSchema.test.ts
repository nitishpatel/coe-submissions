import { signupSchema } from "./SignupSchemas";

describe("Signup schema",()=>{
  it("fails if email is missing",()=>{
    const result = signupSchema.safeParse({});
    expect(result.success).toBe(false);
  })
});