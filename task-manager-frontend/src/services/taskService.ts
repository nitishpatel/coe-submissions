
import type { Task, TaskCreateRequest, TaskList } from "../types";
import { httpService } from "./http";
import { withFallback } from "../utils/apiUtils";

export const taskService = {
  list: async (): Promise<TaskList> => {
    return withFallback(
      () => httpService.get<TaskList>("/tasks"),
      { tasks: [] } as unknown as TaskList,
      { toastOnError: true, toastMessage: "Error fetching tasks" }
    );
  },
  deleteTask:(taskId:string)=>{
    return withFallback(
      () => httpService.delete(`/tasks/${taskId}`),
      undefined,
      { toastOnError: true, toastMessage: "Error Deleting Task" }
    );
  },
  addTask: async(data:TaskCreateRequest):Promise<Task>=>{
    return withFallback(
      () => httpService.post<Task>(`/tasks`,data),
      undefined,
      { toastOnError: true, toastMessage: "Error Deleting Task" }
    );
  },
  updateTask: async(taskId:string,data:TaskCreateRequest):Promise<Task>=>{
    return withFallback(
      () => httpService.patch<Task>(`/tasks/${taskId}`,data),
      undefined,
      { toastOnError: true, toastMessage: "Error Updating Task" }
    );
  }
};
export async function taskListLoader(): Promise<TaskList> {
  return taskService.list();
}

export default taskService;