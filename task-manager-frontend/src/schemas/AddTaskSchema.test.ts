import type { TaskCreateRequest } from "../types";

const validTask:TaskCreateRequest = {
  title: "Task 1",
  description:"Task 1 Description",
  status:"todo"
}

describe("AddTask schema", () => {
  it("fails if title is missing", () => {
    const result = addtaskSchema.safeParse({
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
