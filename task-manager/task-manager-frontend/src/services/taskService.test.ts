import { describe, it, expect, vi, beforeEach } from "vitest";
import { taskListApiPath, taskService } from "./taskService";
import { taskCreateRequestMock, taskCreateResponseMock, taskListResponseMock } from "../mocks/taskResponse.mock";
import type { ParsedTaskListQuery } from "../schemas/TaskListSchema";

const hoisted = vi.hoisted(() => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => hoisted.axiosInstance),
    },
  };
});



beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(hoisted.axiosInstance).forEach((v: any) => {
    if (typeof v?.mock?.clear === "function") v.mock.clear();
  });
  hoisted.axiosInstance.interceptors.request.use.mockClear();
  hoisted.axiosInstance.interceptors.response.use.mockClear();
});

describe("taskService", () => {
  it("should return a list of tasks", async () => {
    const query: ParsedTaskListQuery = {
      page: 1,
      limit: 10,
      order: "asc",
      task_status: undefined,
      sort_by: undefined,
      date_from: undefined,
      date_to: undefined,
      title: undefined,
    };

    hoisted.axiosInstance.get.mockResolvedValueOnce({ data: taskListResponseMock });

    const result = await taskService.list(query);

    expect(hoisted.axiosInstance.get).toHaveBeenCalledWith(taskListApiPath(query),undefined);
    expect(result).toEqual(taskListResponseMock);
  });
  it("should respond with status 204", async () => {
    hoisted.axiosInstance.delete.mockResolvedValueOnce({
      status: 204,
      data: null,
    });

    const result = await taskService.deleteTask("123");

    expect(hoisted.axiosInstance.delete).toHaveBeenCalledWith(
      `/tasks/123`,
      undefined
    );
  });
  it("add task should return with 201 created", async () => {
    hoisted.axiosInstance.post.mockResolvedValueOnce({
      status: 201,
      data: taskCreateResponseMock,
    });

    const result = await taskService.addTask(taskCreateRequestMock);

    expect(hoisted.axiosInstance.post).toHaveBeenCalledWith(
      `/tasks`,
      taskCreateRequestMock,
      undefined
    );

    expect(result).toEqual(taskCreateResponseMock);
  });
  it("updated task should return with 200", async () => {
    hoisted.axiosInstance.patch.mockResolvedValueOnce({
      status: 200,
      data: taskCreateResponseMock,
    });

    const result = await taskService.updateTask("1", taskCreateRequestMock);

    expect(hoisted.axiosInstance.patch).toHaveBeenCalledWith(
      `/tasks/1`,
      taskCreateRequestMock,
      undefined
    );

    expect(result).toEqual(taskCreateResponseMock);
  });
});
