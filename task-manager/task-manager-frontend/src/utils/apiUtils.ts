// src/utils/apiUtils.ts
import type { AxiosResponse } from "axios";
import toast from "react-hot-toast";

type WithFallbackOpts = {
  toastOnError?: boolean;
  toastMessage?: string;
  // when true (default) treat 401 as already-handled by httpService and return fallback
  treat401AsFallback?: boolean;
};

export async function withFallback<T>(
  fn: () => Promise<AxiosResponse<T>>,
  fallback?: T,
  options: WithFallbackOpts = {}
): Promise<T> {
  try {
    const { data } = await fn();
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      if (options.treat401AsFallback ?? true) {
        if (fallback !== undefined) return fallback;
        throw err;
      }
    }

    if (options.toastOnError) {
      toast.error(options.toastMessage ?? "Something went wrong");
    }

    if (fallback !== undefined) {
      return fallback;
    }

    throw err;
  }
}
