import type { TaskCreateRequest } from "../types";
import { addTaskSchema } from "./AddTaskSchema";

const validTask:TaskCreateRequest = {
  title: "Task 1",
  description:"Task 1 Description",
  status:"todo"
}

describe("AddTask schema", () => {
  it("fails if title is missing", () => {
    const result = addTaskSchema.safeParse({
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["title"],
            message: "Title should be between 2 to 200 characters long",
          }),
        ])
      );
    }
  });
  it("fails if title is less than 2 characters", () => {
    const result = addTaskSchema.safeParse({
      title:"A"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["title"],
            message: "Title should be between 2 to 200 characters long",
          }),
        ])
      );
    }
  });
  it("fails if title is more than 200 characters", () => {
    const result = addTaskSchema.safeParse({
      title:"A".repeat(201)
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["title"],
            message: "Title should be between 2 to 200 characters long",
          }),
        ])
      );
    }
  });
});
