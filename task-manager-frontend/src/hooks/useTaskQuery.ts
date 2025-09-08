import { useSearchParams, useNavigate } from "react-router";
import { useCallback, useMemo } from "react";
import { buildTaskListQuery, parseTaskListQuery } from "../utils/queryHelper";

export function useTaskQuery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parsed = useMemo(() => parseTaskListQuery(searchParams.toString()), [searchParams]);
  const push = useCallback((next: Partial<typeof parsed>, { replace=false } = {}) => {
    const qs = buildTaskListQuery({ ...parsed, ...next });
    navigate(`/task-list${qs}`, { replace });
  }, [parsed, navigate]);
  return { q: parsed, push };
}
