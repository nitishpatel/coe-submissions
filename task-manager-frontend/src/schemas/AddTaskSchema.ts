import { z } from "zod";

export const addTaskSchema = z
  .object({
    title: z.string("Title should be between 2 to 200 characters long")
    .min(2,"Title should be between 2 to 200 characters long")
    .max(200,"Title should be between 2 to 200 characters long"),
  })
  .strict()

export type AddTaskFormData = z.infer<typeof addTaskSchema>;
