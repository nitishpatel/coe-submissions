import { render, screen } from "@testing-library/react";
import TaskDeleteModal from "./TaskDeleteModal";

describe("Task Delete Modal", () => {
  beforeEach(() => {
    render(<TaskDeleteModal taskId="123" onClose={() => {}} title="TaskA" />);
  });
  it("renders the title of the task to be delete in the modal", () => {
    expect(screen.getByText(/TaskA/i)).toBeInTheDocument();
  });
  it("renders the cancel button", () => {
    expect(screen.getByRole("button", { name: /cancel/i })).toBeVisible();
  });
  it("renders the save button", () => {
    expect(screen.getByRole("button", { name: /delete/i })).toBeVisible();
  });
});
