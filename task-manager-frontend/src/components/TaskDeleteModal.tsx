import React from "react";
import { ModalShell } from "./ModalShell";

const TaskDeleteModal: React.FC<{
  title: string;
  onClose: () => void;
}> = ({ title, onClose }) => {
  return (
    <ModalShell
      title="Delete task"
      onClose={() => onClose()}
      footer={
        <>
          <button
            onClick={() => onClose()}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement Delete API
              // later -> DELETE /api/v1/tasks/{id}
              onClose();
            }}
            className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-700">This action cannot be undone.</p>
      <p className="text-sm text-slate-500 truncate">
        Task: <span className="font-medium">{title}</span>
      </p>
    </ModalShell>
  );
};

export default TaskDeleteModal;
