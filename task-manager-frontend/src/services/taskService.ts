
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
};
export async function taskListLoader(): Promise<TaskList> {
  return taskService.list();
}

export default taskService;