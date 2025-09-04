import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email("Invalid email"),
  })
  .strict()

export type LoginFormData = z.infer<typeof loginSchema>;
