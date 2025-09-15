import { Navigate, Outlet } from "react-router";
import { useIsAuthenticated } from "../store/authStore";

type Props = {
  redirectTo?: string;
};

export default function UnprotectedRoute({ redirectTo = "/task-list" }: Props) {
  const isAuthed = useIsAuthenticated();
  if (isAuthed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
