import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AddOrEditModal } from "./TaskAddOrEditModal";

describe("Task Add or Edit Modal", () => {
  beforeEach(() => {
    render(
      <AddOrEditModal
        onClose={() => {}}
        onSubmit={() => {}}
        title="Add Task"
        initial={{ title: "", description: "", status: "todo" }}
      />
    );
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
    expect(await screen.findByText(/Title should be between 2 to 200 characters long/i)).toBeInTheDocument();
  });
  it("should render title error field max length check", async () => {
    fireEvent.input(screen.getByLabelText(/Title/i), {
      target: {
        value: "A".repeat(201),
      },
    });
    expect(await screen.findByText(/Title should be between 2 to 200 characters long/i)).toBeInTheDocument();
  });
});
