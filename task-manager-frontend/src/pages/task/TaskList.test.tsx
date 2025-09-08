import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory, type MemoryHistory } from "history";
import * as RRD from "react-router";
import { taskListResponseMock } from "../../mocks/taskResponse.mock";
import TaskList from "./TaskList";

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

describe("TaskList pagination & limit", () => {
  beforeEach(() => {
    // supply loader data and a stubbed revalidator
    (RRD.useLoaderData as unknown as vi.Mock).mockReturnValue(taskListResponseMock);
    (RRD.useRevalidator as unknown as vi.Mock) = vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle",
    }));
  });

  it("clicking Next should increment page query param", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list?page=1"] });

    render(
      <Router location={history.location.pathname + history.location.search} navigator={history}>
        <TaskList />
      </Router>
    );

    // click Next
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // wait for navigation to happen
    await waitFor(() => {
      // expect page param to be 2
      expect(history.location.search).toMatch(/page=2/);
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("clicking Prev should decrement page query param (but not go below 1)", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list?page=2"] });

    render(
      <Router location={history.location.pathname + history.location.search} navigator={history}>
        <TaskList />
      </Router>
    );

    // click Prev
    fireEvent.click(screen.getByRole("button", { name: /prev/i }));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("changing Limit should update the limit query param (and reset page to 1)", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list?page=3&limit=10"] });

    render(
      <Router location={history.location.pathname + history.location.search} navigator={history}>
        <TaskList />
      </Router>
    );

    // find the Limit select and change it to 20
    // the label text in your component is "Limit" — adjust if different
    const limitSelect = screen.getByRole("combobox", { name: /limit/i });
    fireEvent.change(limitSelect, { target: { value: "20" } });

    await waitFor(() => {
      // expect limit param updated to 20
      expect(history.location.search).toMatch(/limit=20/);
      expect(history.location.pathname).toBe("/task-list");
    });
  });
});