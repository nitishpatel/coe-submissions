import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Invalid email"),
    fullName: z.string().optional().nullable(),
    password: z
    .string("Password is mandatory")
    .min(8, "Password must be between 8 and 26 characters")
    .max(26, "Password must be between 8 and 26 characters"),
    confirmPassword: z.string("Confirm Password is mandatory")
    .min(1,"Confirm Password is mandatory")
  })
  .refine((data)=>data.password === data.confirmPassword,{
    path:["confirmPassword"],
    message:"Password do not match"
  })
  .strict()

export type SignupFormData = z.infer<typeof signupSchema>;
