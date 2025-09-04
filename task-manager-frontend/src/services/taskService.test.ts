import { describe, it, expect, vi, beforeEach } from "vitest";
import { taskService } from "./taskService";
import { taskListResponseMock } from "../mocks/taskResponse.mock";

const hoisted = vi.hoisted(() => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
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

describe("authService", () => {
  it("should return a list of tasks", async () => {
    hoisted.axiosInstance.get.mockResolvedValueOnce({ data: taskListResponseMock });

    const result = await taskService.list();

    expect(hoisted.axiosInstance.get).toHaveBeenCalledWith("/tasks", undefined);
    expect(result).toEqual(taskListResponseMock);
  });
});
