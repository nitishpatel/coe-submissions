
import type { Task, TaskCreateRequest, TaskList, TaskUpdateRequest } from "../types";
import { httpService } from "./http";
import { withFallback } from "../utils/apiUtils";
import type { ParsedTaskListQuery } from "../schemas/TaskListSchema";
import type { LoaderFunctionArgs } from "react-router";
import { parseTaskListQuery } from "../utils/queryHelper";

export function taskListApiPath(q: ParsedTaskListQuery) {
  const p = new URLSearchParams();
  p.set("page", String(q.page));
  p.set("limit", String(q.limit));
  if (q.task_status) p.set("task_status", q.task_status);
  if (q.sort_by) p.set("sort_by", q.sort_by);
  if (q.order) p.set("order", q.order);
  if (q.date_from) p.set("date_from", q.date_from);
  if (q.date_to) p.set("date_to", q.date_to);
  return `/tasks?${p.toString()}`;
}


export const taskService = {
  list: async (query:ParsedTaskListQuery): Promise<TaskList> => {
    const path = taskListApiPath(query);
    return withFallback(
      () => httpService.get<TaskList>(path),
      { tasks: [] } as unknown as TaskList,
      { toastOnError: true, toastMessage: "Error fetching tasks" }
    );
  },
  deleteTask: (taskId: string) => {
    return withFallback(
      () => httpService.delete(`/tasks/${taskId}`),
      undefined,
      { toastOnError: true, toastMessage: "Error Deleting Task" }
    );
  },
  addTask: async (data: TaskCreateRequest): Promise<Task> => {
    return withFallback(
      () => httpService.post<Task>(`/tasks`, data),
      undefined,
      { toastOnError: true, toastMessage: "Error Deleting Task" }
    );
  },
  updateTask: async (taskId: string, data: TaskUpdateRequest): Promise<Task> => {
    return withFallback(
      () => httpService.patch<Task>(`/tasks/${taskId}`, data),
      undefined,
      { toastOnError: true, toastMessage: "Error Updating Task" }
    );
  }
};
export async function taskListLoader({ request }: LoaderFunctionArgs) {
  const parsed = parseTaskListQuery(new URL(request.url).search);
  return taskService.list(parsed);
}

export default taskService;