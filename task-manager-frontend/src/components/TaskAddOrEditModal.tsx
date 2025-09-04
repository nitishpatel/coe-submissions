import React from "react";
import type { Status } from "../types";
import { ModalShell } from "./ModalShell";

const StatusSelect: React.FC<{
  value: Status;
  onChange: (s: Status) => void;
}> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as Status)}
    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
  >
    <option value="todo">To do</option>
    <option value="in_progress">In progress</option>
    <option value="done">Done</option>
  </select>
);

export const AddOrEditModal: React.FC<{
  title: string;
  initial: { title: string; description?: string; status: Status };
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: Status;
  }) => void;
}> = ({ title, initial, onClose, onSubmit }) => {
  const [vTitle, setVTitle] = React.useState(initial.title);
  const [vDesc, setVDesc] = React.useState(initial.description ?? "");
  const [vStatus, setVStatus] = React.useState<Status>(initial.status);

  return (
    <ModalShell
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({ title: vTitle, description: vDesc, status: vStatus })
            }
            className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!vTitle.trim()}
          >
            Save
          </button>
        </>
      }
    >
      <label className="block">
        <span className="block text-xs text-slate-600 mb-1">Title</span>
        <input
          value={vTitle}
          onChange={(e) => setVTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Brief summary"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-slate-600 mb-1">Description</span>
        <textarea
          value={vDesc}
          onChange={(e) => setVDesc(e.target.value)}
          className="w-full min-h-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Optional details"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-slate-600 mb-1">Status</span>
        <StatusSelect value={vStatus} onChange={setVStatus} />
      </label>
    </ModalShell>
  );
};
