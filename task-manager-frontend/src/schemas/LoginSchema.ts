import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email("Invalid email"),
    password: z.string("Please enter a password")
    .min(1,"Please enter a password"),
  })
  .strict()

export type LoginFormData = z.infer<typeof loginSchema>;
