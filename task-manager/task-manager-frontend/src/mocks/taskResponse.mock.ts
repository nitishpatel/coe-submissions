import type { Task, TaskCreateRequest } from "../types";

export const taskListResponseMock: Task[] = [
  {
    id: "1",
    title: "Write unit tests",
    description: "Cover edge cases for delete modal",
    status: "todo",
    created_at: "2025-09-04T10:00:00Z",
    updated_at: "2025-09-04T10:00:00Z",
  },
  {
    id: "2",
    title: "Implement delete API",
    description: "Wire frontend modal with backend DELETE /tasks/:id",
    status: "in_progress",
    created_at: "2025-09-04T11:00:00Z",
    updated_at: "2025-09-04T11:15:00Z",
  },
  {
    id: "3",
    title: "Implement delete API 2",
    description: "Wire frontend modal with backend DELETE /tasks/:id",
    status: "done",
    created_at: "2025-09-04T11:00:00Z",
    updated_at: "2025-09-04T11:15:00Z",
  },
];

export const taskCreateRequestMock: TaskCreateRequest = {
  title: "Task 1",
  description: "Task 1 Description",
  status: "todo"
}
export const taskCreateResponseMock: Task = {
  id: "1",
  title: "Task 1",
  description: "Task 1 Description",
  status: "todo",
  created_at: "2025-09-04T10:00:00Z",
  updated_at: "2025-09-04T10:00:00Z",
}