import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "../store/authStore";

type Props = {
  redirectTo?: string;
};

export default function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const isAuthed = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
