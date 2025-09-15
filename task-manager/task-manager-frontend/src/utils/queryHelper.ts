import { taskListQuerySchema, type ParsedTaskListQuery } from "../schemas/TaskListSchema";

export function parseTaskListQuery(search: string): ParsedTaskListQuery {
  const params = new URLSearchParams(search);
  const raw = {
    page: params.get("page") ?? undefined,
    limit: params.get("limit") ?? undefined,
    task_status: params.get("task_status") ?? undefined,
    sort_by: params.get("sort_by") ?? undefined,
    order: params.get("order") ?? undefined,
    date_from: params.get("date_from") ?? undefined,
    date_to: params.get("date_to") ?? undefined,
  };
  return taskListQuerySchema.parse(raw);
}

export function buildTaskListQuery(q: Partial<ParsedTaskListQuery>): string {
  const normalized = taskListQuerySchema.parse(q);
  const params = new URLSearchParams();
  if (normalized.page !== 1) params.set("page", String(normalized.page));
  if (normalized.limit !== 10) params.set("limit", String(normalized.limit));
  if (normalized.task_status) params.set("task_status", normalized.task_status);
  if (normalized.sort_by) params.set("sort_by", normalized.sort_by);
  if (normalized.order !== "asc") params.set("order", normalized.order);
  if (normalized.date_from) params.set("date_from", normalized.date_from);
  if (normalized.date_to) params.set("date_to", normalized.date_to);
  const s = params.toString();
  return s ? `?${s}` : "";
}
