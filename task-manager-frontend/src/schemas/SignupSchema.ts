import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),
    fullName:z.string().optional().nullable(),
    password:z.string("Password is mandatory")
  }).strict();

export type SignupFormData = z.infer<typeof signupSchema>;
