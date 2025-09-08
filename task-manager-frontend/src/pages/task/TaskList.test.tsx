import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";
import { Router } from "react-router";
import { createMemoryHistory, type MemoryHistory } from "history";
import * as RRD from "react-router";
import { taskListResponseMock } from "../../mocks/taskResponse.mock";

vi.mock("react-router", async () => {
  const actual: typeof RRD = await vi.importActual("react-router");
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});
describe("Tasklist", () => {
  let history: MemoryHistory;
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/login"],
    });
    (RRD.useLoaderData as unknown as vi.Mock).mockReturnValue(
      taskListResponseMock
    );
    (RRD.useRevalidator as unknown as vi.Mock) = vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle",
    }));
    render(
      <Router location={history.location.pathname} navigator={history}>
        <TaskList />
      </Router>
    );
  });
  it("renders the heading of the tasklist page", () => {
    expect(screen.getByText(/Your Tasks/i)).toBeInTheDocument();
  });
  it("renders the one column for each task status", () => {
    expect(screen.getByText(/Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/WIP/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });
  it("renders the add task button", () => {
    expect(
      screen.getByRole("button", { name: /Add Task/i })
    ).toBeInTheDocument();
  });
  it("renders the reset button", () => {
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });
  it("renders the pagination button", () => {
    expect(screen.getByRole("button", { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
  it("renders the filter dropdowns", () => {
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/created from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/created to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
  });
});
