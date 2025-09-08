// src/schemas/TaskListSchema.test.ts
import { describe, it, expect } from "vitest";
import { taskListQuerySchema } from "./TaskListSchema"; // adjust path if needed

describe("taskListQuerySchema", () => {
  it("should apply defaults for page, limit, and order", () => {
    const result = taskListQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.order).toBe("asc");
  });

  it("should coerce page and limit from strings", () => {
    const result = taskListQuerySchema.parse({
      page: "2",
      limit: "20",
    });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(20);
  });

  it("should reject page < 1", () => {
    const res = taskListQuerySchema.safeParse({ page: 0 });
    expect(res.success).toBe(false);
    if (!res.success) {
      const err = res.error.issues.find((e) => e.path?.[0] === "page");
      expect(err).toBeDefined();
      expect(err?.message).toMatch(/Too small: expected number to be >=1/);
    }
  });

  it("should reject limit < 1 or > 100", () => {
    expect(taskListQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(taskListQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it("should accept valid task_status values", () => {
    expect(taskListQuerySchema.parse({ task_status: "todo" }).task_status).toBe("todo");
    expect(taskListQuerySchema.parse({ task_status: "in_progress" }).task_status).toBe("in_progress");
    expect(taskListQuerySchema.parse({ task_status: "done" }).task_status).toBe("done");
  });

  it("should reject invalid task_status value", () => {
    expect(taskListQuerySchema.safeParse({ task_status: "invalid" as any }).success).toBe(false);
  });

  it("should accept valid sort_by values", () => {
    expect(taskListQuerySchema.parse({ sort_by: "created_at" }).sort_by).toBe("created_at");
    expect(taskListQuerySchema.parse({ sort_by: "status" }).sort_by).toBe("status");
  });

  it("should reject invalid sort_by value", () => {
    expect(taskListQuerySchema.safeParse({ sort_by: "title" as any }).success).toBe(false);
  });

  it("should accept asc/desc order", () => {
    expect(taskListQuerySchema.parse({ order: "asc" }).order).toBe("asc");
    expect(taskListQuerySchema.parse({ order: "desc" }).order).toBe("desc");
  });

  it("should reject invalid order", () => {
    expect(taskListQuerySchema.safeParse({ order: "random" as any }).success).toBe(false);
  });

  it("should accept valid YYYY-MM-DD dates", () => {
    const result = taskListQuerySchema.parse({
      date_from: "2025-01-01",
      date_to: "2025-12-31",
    });
    expect(result.date_from).toBe("2025-01-01");
    expect(result.date_to).toBe("2025-12-31");
  });

  it("should reject invalid date format", () => {
    const res = taskListQuerySchema.safeParse({ date_from: "01-01-2025" });
    expect(res.success).toBe(false);
    if (!res.success) {
      const err = res.error.issues.find((e) => e.path?.[0] === "date_from");
      expect(err).toBeDefined();
      expect(err?.message).toMatch(/match pattern/);
    }
  });

  it("should allow nullable/optional values", () => {
    const result = taskListQuerySchema.parse({
      task_status: null,
      sort_by: null,
      date_from: null,
      date_to: null,
    });
    expect(result.task_status).toBeNull();
    expect(result.sort_by).toBeNull();
    expect(result.date_from).toBeNull();
    expect(result.date_to).toBeNull();
  });
});
