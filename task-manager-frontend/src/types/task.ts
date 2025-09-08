export type Status = "todo" | "in_progress" | "done";
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type TaskList = Task[];

export type TaskCreateRequest = {
  title: string;
  description?: string;
  status: Status;
}
export type TaskUpdateRequest = {
  title?: string;
  description?: string;
  status?: Status;
}