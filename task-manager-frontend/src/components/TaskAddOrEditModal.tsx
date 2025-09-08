// AddOrEditModal.tsx
import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalShell } from "./ModalShell";
import type { Status, TaskCreateRequest } from "../types";
import { addTaskSchema, type AddTaskFormData } from "../schemas/AddTaskSchema";
import taskService from "../services/taskService";
import toast from "react-hot-toast";

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
  onSubmit: (data: AddTaskFormData) => void;
}> = ({ title, initial, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    mode: "onChange",
    defaultValues: {
      title: initial.title,
      description: initial.description ?? undefined,
      status: initial.status ?? "todo",
    },
  });

  const submit: SubmitHandler<AddTaskFormData> = async (data) => {
    try {
      console.log("🚀 ~ submit ~ data:", data);
      const result = await taskService.addTask(data as TaskCreateRequest);
      if (result) {
        toast.success("Task Added Successfully!");
      }
      onSubmit(data);
    } catch (e) {
      toast.error("Error adding Task!");
    }
  };

  return (
    <ModalShell
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(submit)}
            className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!isValid || isSubmitting}
            type="button"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Title</span>
          <input
            {...register("title")}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-500 focus:ring-red-300"
                : "border-slate-200 focus:ring-indigo-300"
            }`}
            placeholder="Brief summary"
          />
          {errors.title ? (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Description</span>
          <textarea
            {...register("description")}
            className={`w-full min-h-20 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.description
                ? "border-red-500 focus:ring-red-300"
                : "border-slate-200 focus:ring-indigo-300"
            }`}
            placeholder="Optional details"
          />
          {errors.description ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Status</span>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <StatusSelect
                value={field.value}
                onChange={(s) => field.onChange(s)}
              />
            )}
          />
          {errors.status ? (
            <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
          ) : null}
        </label>

        {/* Hidden submit to allow Enter key submissions */}
        <button type="submit" className="hidden" aria-hidden />
      </form>
    </ModalShell>
  );
};

export default AddOrEditModal;
