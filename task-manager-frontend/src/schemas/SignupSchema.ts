import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),
    fullname:z.string().optional().nullable()
  }).strict();

export type SignupFormData = z.infer<typeof signupSchema>;
