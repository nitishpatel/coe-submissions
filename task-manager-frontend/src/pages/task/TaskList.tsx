import React, { useEffect } from "react";
import type { Status, Task, TaskList } from "../../types";
import { AddOrEditModal } from "../../components/TaskAddOrEditModal";
import TaskDeleteModal from "../../components/TaskDeleteModal";
import { useLoaderData, useRevalidator } from "react-router";
import taskService from "../../services/taskService";

type Props = {
  initial?: Task[]; // seed list
};

const STATUS_META: Record<
  Status,
  { label: string; tint: string; chip: string }
> = {
  todo: {
    label: "To do",
    tint: "bg-slate-200",
    chip: "bg-slate-100 text-slate-700",
  },
  in_progress: {
    label: "In progress",
    tint: "bg-indigo-200",
    chip: "bg-indigo-50 text-indigo-700",
  },
  done: {
    label: "Done",
    tint: "bg-emerald-200",
    chip: "bg-emerald-50 text-emerald-700",
  },
};

const humanDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric" });
};

// ===== Card =====
const TaskCard: React.FC<{
  task: Task;
  onDragStart: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveLeft: (task: Task) => void;
  onMoveRight: (task: Task) => void;
}> = ({ task, onDragStart, onEdit, onDelete, onMoveLeft, onMoveRight }) => {
  const meta = STATUS_META[task.status];
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      className="group rounded-xl border border-slate-200 bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition p-3 space-y-2 cursor-grab active:cursor-grabbing"
    >
      <header className="flex items-start gap-2">
        <span className={`mt-1 h-2.5 w-2.5 rounded ${meta.tint}`} />
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold text-slate-800 leading-5 truncate"
            title={task.title}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1.5 hover:bg-slate-50"
            aria-label="Edit task"
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M12 20h9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-md p-1.5 hover:bg-slate-50"
            aria-label="Delete task"
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 text-[11px]">
        <span className={`px-1.5 py-0.5 rounded ${meta.chip}`}>
          {STATUS_META[task.status].label}
        </span>
        <span
          className="ml-auto text-slate-500"
          title={`Updated ${new Date(task.updated_at).toLocaleString()}`}
        >
          Created {humanDate(task.created_at)}
        </span>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition flex justify-between pt-1">
        <button
          onClick={() => onMoveLeft(task)}
          className="text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
        >
          ← Move
        </button>
        <button
          onClick={() => onMoveRight(task)}
          className="text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
        >
          Move →
        </button>
      </div>
    </article>
  );
};

// ===== Column =====
const Column: React.FC<{
  status: Status;
  tasks: Task[];
  onDropTask: (id: string, to: Status) => void;
  onDragOver: (status: Status | null) => void;
  onDragStartCard: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveLeft: (task: Task) => void;
  onMoveRight: (task: Task) => void;
}> = ({
  status,
  tasks,
  onDropTask,
  onDragOver,
  onDragStartCard,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
}) => {
  const meta = STATUS_META[status];
  return (
    <section
      role="list"
      aria-label={`${meta.label} column`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(status);
      }}
      onDragLeave={() => onDragOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDropTask(id, status);
        onDragOver(null);
      }}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-sm p-3 min-h-[60vh]"
    >
      <header className="sticky top-0 z-10 -m-3 mb-1 p-3 rounded-t-2xl bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded ${meta.tint}`} />
          <h2 className="text-sm font-semibold text-slate-800">{meta.label}</h2>
          <span className="ml-1 text-xs text-slate-500">({tasks.length})</span>
          <span className="ml-auto text-[10px] text-slate-400">
            {status === "todo"
              ? "Queue"
              : status === "in_progress"
              ? "WIP"
              : "Completed"}
          </span>
        </div>
      </header>

      {tasks.length === 0 && (
        <div className="grid place-items-center h-32 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
          No tasks match filters
        </div>
      )}

      <div className="grid gap-3 auto-rows-min">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onDragStart={onDragStartCard}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
          />
        ))}
      </div>
    </section>
  );
};

const TaskList: React.FC<Props> = ({ initial }) => {
  const tasks = useLoaderData() as TaskList;
  const revalidator = useRevalidator();

  const [filterTitle, setFilterTitle] = React.useState(""); // client-side
  const [taskStatus, setTaskStatus] = React.useState<"" | Status>(""); // task_status
  const [dateFrom, setDateFrom] = React.useState(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = React.useState(""); // YYYY-MM-DD
  const [sortBy, setSortBy] = React.useState<"" | "created_at" | "status">(
    "created_at"
  );
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  // UI state
  const [hoverCol, setHoverCol] = React.useState<Status | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState<null | Task>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<null | Task>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);

  // group into columns (client display)
  const grouped = React.useMemo(() => {
    const by: Record<Status, Task[]> = { todo: [], in_progress: [], done: [] };
    tasks.forEach((t) => by[t.status].push(t));
    return by;
  }, [tasks]);

  // ===== UI Handlers (intention-revealing, easy to wire later) =====
  const moveStatus = async (task: Task, dir: "left" | "right") => {
    const order: Status[] = ["todo", "in_progress", "done"];
    const idx = order.indexOf(task.status);
    const next =
      dir === "left"
        ? order[Math.max(0, idx - 1)]
        : order[Math.min(order.length - 1, idx + 1)];
    if (next !== task.status) {
      await taskService.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: next,
      });
      revalidator.revalidate();
      // later -> PATCH /api/v1/tasks/{id} { status: next }
    }
  };

  const onDropTask = async (id: string, to: Status) => {
    await taskService.updateTask(id, {
      status: to,
    });
    revalidator.revalidate();
    setDragId(null);
    // later -> PATCH /api/v1/tasks/{id} { status: to }
  };

  // ===== Render =====
  return (
    <main className="px-4 md:px-6 lg:px-10 xl:px-16 py-8 md:py-12">
      {/* Filters Toolbar -> maps to GET /api/v1/tasks */}
      <header className="mb-6 md:mb-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
              Your Tasks
            </h1>
            <p className="text-xs text-slate-500">
              Filter, sort, and page—ready for your API.
            </p>
          </div>
        </div>

        {/* Pagination controls (page & limit) */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white/60">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-sm rounded-l-lg hover:bg-slate-50"
            >
              Prev
            </button>
            <div className="px-3 py-1.5 text-sm border-x border-slate-200">
              Page {page}
            </div>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm rounded-r-lg hover:bg-slate-50"
            >
              Next
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Limit</span>
            <select
              value={limit}
              onChange={(e) => {
                const v = Math.min(100, Math.max(1, Number(e.target.value)));
                setLimit(v);
                setPage(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="w-full md:w-auto md:ml-auto flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center md:items-end md:justify-end">
            {/* task_status */}
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Status</span>
              <select
                value={taskStatus}
                onChange={(e) => {
                  setTaskStatus(e.target.value as "" | Status);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">All</option>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            {/* date_from */}
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">
                Created from
              </span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            {/* date_to */}
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">
                Created to
              </span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            {/* sort_by + order */}
            <div className="flex gap-2">
              <label className="block">
                <span className="block text-xs text-slate-600 mb-1">
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "" | "created_at" | "status")
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="created_at">Created at</option>
                  <option value="status">Status</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-slate-600 mb-1">Order</span>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              setFilterTitle("");
              setTaskStatus("");
              setDateFrom("");
              setDateTo("");
              setSortBy("created_at");
              setOrder("asc");
              setPage(1);
              setLimit(10);
            }}
            className="ml-auto px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2"
          >
            Add task
          </button>
        </div>
      </header>

      {/* Board */}
      <section
        className={`grid gap-4 md:gap-6`}
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {(["todo", "in_progress", "done"] as Status[]).map((s) => (
          <div
            key={s}
            className={
              hoverCol === s ? "ring-2 ring-indigo-300 rounded-2xl" : ""
            }
          >
            <Column
              status={s}
              tasks={grouped[s]}
              onDropTask={onDropTask}
              onDragOver={(st) => setHoverCol(st)}
              onDragStartCard={(id) => setDragId(id)}
              onEdit={(t) => setShowEdit(t)}
              onDelete={(t) => setConfirmDelete(t)}
              onMoveLeft={(t) => moveStatus(t, "left")}
              onMoveRight={(t) => moveStatus(t, "right")}
            />
          </div>
        ))}
      </section>

      {/* ===== Add modal (POST /api/v1/tasks) ===== */}
      {showAdd && (
        <AddOrEditModal
          title="Add new task"
          initial={{ title: "", description: "", status: "todo" }}
          onClose={() => setShowAdd(false)}
          onSubmit={(values) => {
            setShowAdd(false);
            revalidator.revalidate();
          }}
        />
      )}

      {/* ===== Edit modal (PATCH /api/v1/tasks/{id}) ===== */}
      {showEdit && (
        <AddOrEditModal
          title="Edit task"
          initial={{
            id: showEdit.id,
            title: showEdit.title,
            description: showEdit.description ?? "",
            status: showEdit.status,
          }}
          onClose={() => setShowEdit(null)}
          onSubmit={(values) => {
            setShowEdit(null);
            revalidator.revalidate();
          }}
        />
      )}

      {/* ===== Delete confirm (DELETE /api/v1/tasks/{id}) ===== */}
      {confirmDelete && (
        <TaskDeleteModal
          title="Confirm Delete?"
          taskId={confirmDelete.id}
          onClose={() => {
            setConfirmDelete(null);
            revalidator.revalidate();
          }}
        />
      )}
    </main>
  );
};

export default TaskList;
