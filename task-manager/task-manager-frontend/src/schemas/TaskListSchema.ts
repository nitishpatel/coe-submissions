import { z } from "zod";

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  task_status: z.enum(["todo","in_progress","done"]).nullable().optional(),
  sort_by: z.enum(["created_at","status"]).nullable().optional(),
  order: z.enum(["asc","desc"]).default("asc"),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
}).strict();

export type ParsedTaskListQuery = z.infer<typeof taskListQuerySchema>;
