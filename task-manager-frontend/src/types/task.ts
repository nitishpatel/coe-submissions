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