import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),
  }).strict();

export type SignupFormData = z.infer<typeof signupSchema>;
