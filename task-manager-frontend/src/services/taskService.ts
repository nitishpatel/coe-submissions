
import type { TaskList } from "../types";
import { httpService } from "./http";

export const taskService = {
  list: async () => {
    const {data} = await httpService.get<TaskList>("/tasks");
    return data;
  }
};
export async function taskListLoader(): Promise<TaskList> {
  return taskService.list();
}

export default taskService;