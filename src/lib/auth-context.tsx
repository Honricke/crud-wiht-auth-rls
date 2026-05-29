import { createContext, useContext, useState, type ReactNode } from "react";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const mockUser: MockUser = {
  id: "123",
  name: "Henrique",
  email: "henrique@example.com",
  avatar: "https://placehold.co/100",
};

interface AuthContextValue {
  user: MockUser | null;
  login: (user: MockUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  return (
    <AuthContext.Provider
      value={{ user, login: (u) => setUser(u), logout: () => setUser(null) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
