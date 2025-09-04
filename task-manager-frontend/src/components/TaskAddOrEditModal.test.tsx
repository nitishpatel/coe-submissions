import { render, screen } from "@testing-library/react";
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
  it("renders the cancel button",()=>{
    expect(screen.getByRole("button",{name:/cancel/i})).toBeVisible();
  })
  it("renders the save button",()=>{
    expect(screen.getByRole("button",{name:/save/i})).toBeVisible();
  })
  it("renders the title field",()=>{
    expect(screen.getByLabelText(/Title/i)).toBeVisible();
  })
  it("renders the status field",()=>{
    expect(screen.getByLabelText(/status/i)).toBeVisible();
  })
  it("renders the description field",()=>{
    expect(screen.getByLabelText(/description/i)).toBeVisible();
  })
});
