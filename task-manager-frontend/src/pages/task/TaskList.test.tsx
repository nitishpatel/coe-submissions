import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";

describe("Tasklist", () => {
  beforeEach(() => {
    render(<TaskList/>)
  });
  it("renders the heading of the tasklist page", () => {
    expect(screen.getByText(/Your Tasks/i)).toBeInTheDocument();
  });
});
