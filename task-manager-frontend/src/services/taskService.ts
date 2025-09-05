
import type { TaskList } from "../types";
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
      () => httpService.delete("/tasks",{
       data:{
         taskId:taskId
       }
      }),
      undefined,
      { toastOnError: true, toastMessage: "Error Deleting Task" }
    );
  }
};
export async function taskListLoader(): Promise<TaskList> {
  return taskService.list();
}

export default taskService;