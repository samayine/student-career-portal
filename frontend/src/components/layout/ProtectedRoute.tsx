import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** If set, only users with this role can access. Others get redirected. */
  role?: "student" | "employer" | "admin";
}

/**
 * Wraps a route so only authenticated users can access it.
 * Shows a loading state while auth initialises, then redirects
 * unauthenticated users to /login (preserving the intended destination).
 */
export default function ProtectedRoute({ children, role }: Props) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
