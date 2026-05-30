import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { ReactNode } from "react";

export function PrivateRoute({ children }: { children: ReactNode }): ReactNode {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  if (!authenticated) navigate({ to: "/login" });

  return children;
}
