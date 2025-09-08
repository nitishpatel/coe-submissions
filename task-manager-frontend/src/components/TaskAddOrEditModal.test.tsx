import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AddOrEditModal } from "./TaskAddOrEditModal";
import {
  taskCreateRequestMock,
  taskCreateResponseMock,
} from "../mocks/taskResponse.mock";
import { taskService } from "../services/taskService";

vi.mock("../services/taskService", () => {
  const addTaskMock = vi.fn();
  const updateTaskMock = vi.fn();
  return {
    taskService: { addTask: addTaskMock, updateTask: updateTaskMock }, // named export
    default: { addTask: addTaskMock, updateTask: updateTaskMock }, // default export
  };
});
describe("Task Add or Edit Modal", () => {
  let unmountModal: () => void;
  beforeEach(() => {
    const { unmount } = render(
      <AddOrEditModal
        onClose={() => {}}
        onSubmit={() => {}}
        title="Add Task"
        initial={{ title: "", description: "", status: "todo" }}
      />
    );
    unmountModal = unmount;
  });
  it("renders the heading of the modal", () => {
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });
  it("renders the cancel button", () => {
    expect(screen.getByRole("button", { name: /cancel/i })).toBeVisible();
  });
  it("renders the save button in disabled state", () => {
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });
  it("renders the title field", () => {
    expect(screen.getByLabelText(/Title/i)).toBeVisible();
  });
  it("renders the status field", () => {
    expect(screen.getByLabelText(/status/i)).toBeVisible();
  });
  it("renders the description field", () => {
    expect(screen.getByLabelText(/description/i)).toBeVisible();
  });
  it("save button to be enabled if form is valid", async () => {
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: {
        value: "Test Title",
      },
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled()
    );
  });
  it("should render title error field min length check", async () => {
    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: {
        value: "A",
      },
    });
    expect(
      await screen.findByText(
        /Title should be between 2 to 200 characters long/i
      )
    ).toBeInTheDocument();
  });
  it("should render title error field max length check", async () => {
    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: {
        value: "A".repeat(201),
      },
    });
    expect(
      await screen.findByText(
        /Title should be between 2 to 200 characters long/i
      )
    ).toBeInTheDocument();
  });
  it("save button should trigger the add task api call", async () => {
    const addTaskMock = vi.mocked(taskService.addTask);
    addTaskMock.mockResolvedValueOnce(taskCreateResponseMock);

    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: { value: "Task 1" },
    });
    fireEvent.input(screen.getByLabelText(/Description/i), {
      target: { value: "Task 1 Description" },
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled()
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(addTaskMock).toHaveBeenCalled();
      expect(addTaskMock).toHaveBeenCalledWith(
        expect.objectContaining(taskCreateRequestMock)
      );
    });
  });
  it("save button should trigger the update task api call when editing the task", async () => {
    unmountModal();
    render(
      <AddOrEditModal
        onClose={() => {}}
        onSubmit={() => {}}
        title="Add Task"
        initial={{
          title: "Task 1",
          description: "Task 1 Description",
          status: "todo",
          id: "1",
        }}
      />
    );
    const updateTaskMock = vi.mocked(taskService.updateTask);
    updateTaskMock.mockResolvedValueOnce(taskCreateResponseMock);

    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: { value: "Updated" },
    });
    fireEvent.input(screen.getByLabelText(/Description/i), {
      target: { value: "Updated" },
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /save/i })).toBeEnabled()
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalled();
      expect(updateTaskMock).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          title: "Updated",
          description: "Updated",
          status: "todo",
        })
      );
    });
  });
});
