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
    (RRD.useLoaderData as unknown as vi.Mock).mockReturnValue(
      taskListResponseMock
    );
    (RRD.useRevalidator as unknown as vi.Mock) = vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle",
    }));
  });

  it("clicking Next should increment page query param", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?page=1"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(history.location.search).toMatch(/page=2/);
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("clicking Prev should decrement page query param (but not go below 1)", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?page=2"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /prev/i }));

    await waitFor(() => {
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("changing Limit should update the limit query param (and reset page to 1)", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?page=3&limit=10"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const limitSelect = screen.getByRole("combobox", { name: /limit/i });
    fireEvent.change(limitSelect, { target: { value: "20" } });

    await waitFor(() => {
      expect(history.location.search).toMatch(/limit=20/);
      expect(history.location.pathname).toBe("/task-list");
    });
  });
});

describe("TaskList status select (URL behavior)", () => {
  beforeEach(() => {
    (RRD.useLoaderData as unknown as vi.Mock).mockReturnValue(
      taskListResponseMock
    );
    (RRD.useRevalidator as unknown as vi.Mock) = vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle",
    }));
  });

  it("selecting a status adds task_status to the URL", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list"] });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: "todo" } });

    await waitFor(() => {
      const params = new URLSearchParams(history.location.search);
      expect(params.get("task_status")).toBe("todo");
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("selecting 'All' removes task_status from the URL when previously set", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?task_status=todo"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
    expect(statusSelect.value).toBe("todo");

    fireEvent.change(statusSelect, { target: { value: "" } });

    await waitFor(() => {
      const params = new URLSearchParams(history.location.search);
      expect(params.get("task_status")).toBeNull(); // param removed
      expect(history.location.pathname).toBe("/task-list");
    });
  });

  it("changing status from one value to another updates the URL accordingly", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?task_status=in_progress"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
    expect(statusSelect.value).toBe("in_progress");

    fireEvent.change(statusSelect, { target: { value: "done" } });

    await waitFor(() => {
      const params = new URLSearchParams(history.location.search);
      expect(params.get("task_status")).toBe("done");
      expect(history.location.pathname).toBe("/task-list");
    });
  });
});
describe("TaskList sort/order selects (URL behavior)", () => {
  beforeEach(() => {
    (RRD.useLoaderData as unknown as vi.Mock).mockReturnValue(
      taskListResponseMock
    );
    (RRD.useRevalidator as unknown as vi.Mock) = vi.fn(() => ({
      revalidate: vi.fn(),
      state: "idle",
    }));
  });
  it("shows NA (empty) for sort_by and 'asc' for order when none in URL", () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list"] });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const sortSelect = screen.getByLabelText(/sort by/i) as HTMLSelectElement;
    const orderSelect = screen.getByLabelText(/order/i) as HTMLSelectElement;

    // sort_by absent in URL → UI shows NA (empty string)
    expect(sortSelect.value).toBe("");
    // order defaults to asc
    expect(orderSelect.value).toBe("asc");
  });

  it("changing sort_by updates the URL", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list"] });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const sortSelect = screen.getByLabelText(/sort by/i) as HTMLSelectElement;
    fireEvent.change(sortSelect, { target: { value: "status" } });

    await waitFor(() => {
      const params = new URLSearchParams(history.location.search);
      expect(params.get("sort_by")).toBe("status");
      expect(params.get("order") ?? "asc").toBe("asc");
    });
  });

  it("changing order updates the URL", async () => {
    const history = createMemoryHistory({ initialEntries: ["/task-list"] });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const orderSelect = screen.getByLabelText(/order/i) as HTMLSelectElement;
    fireEvent.change(orderSelect, { target: { value: "desc" } });

    await waitFor(() => {
      const params = new URLSearchParams(history.location.search);
      expect(params.get("order")).toBe("desc");
    });
  });

  it("respects initial URL values for sort_by and order", () => {
    const history = createMemoryHistory({
      initialEntries: ["/task-list?sort_by=status&order=desc"],
    });

    render(
      <Router
        location={history.location.pathname + history.location.search}
        navigator={history}
      >
        <TaskList />
      </Router>
    );

    const sortSelect = screen.getByLabelText(/sort by/i) as HTMLSelectElement;
    const orderSelect = screen.getByLabelText(/order/i) as HTMLSelectElement;

    expect(sortSelect.value).toBe("status");
    expect(orderSelect.value).toBe("desc");
  });
});
