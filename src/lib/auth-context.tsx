import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "@tanstack/react-router";
import { resolve } from "path";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  logout: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<User>;
  signUp: ({ email, password, name }: SignUp) => Promise<User>;
}

interface SignUp {
  email: string;
  password: string;
  name: string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // load the user. Always, after supabase login or signUp he's at supabase session
  // so, getSession, always receive user data (except unlogged users)
  useEffect(() => {
    async function loadUserSession() {
      setLoading(true);

      // getSession busca só localmente, não valida no supabase,
      // diferente de getUser, por isso é recomendado, pois é mais rápido
      const res = await supabase.auth.getSession();

      setUser(res.data.session?.user ?? null);
      setLoading(false);
    }

    loadUserSession();

    // gera um listener que fica ouvindo os eventos que envolvem usuário: login, logout e etc
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));

    // cleanup, só roda quando o componente desmonta (padrão do useEffect) e para de ouvir
    return subscription.unsubscribe();
  }, []);

  function logout() {
    return new Promise<boolean>(async (resolve, reject) => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        reject(error);
        return;
      }

      resolve(true);
    });
  }

  function login(email: string, password: string) {
    return new Promise<User>(async (resolve, reject) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        reject(error);
        return;
      }

      resolve(data.user ?? ({} as User));
    });
  }

  function signUp({ email, password, name }: SignUp) {
    return new Promise<User>(async (resolve, reject) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // options vai servir se implementar um trigger banco para gerar os profiles
        options: { data: { full_name: name } },
      });

      if (error) {
        reject(error);
        return;
      }

      const { data: _ , error: insertError } = await supabase.from("profiles").insert({
        id: data.user?.id,
        name: name,
      });

      if (insertError) {
        reject(insertError);
        return;
      }

      resolve(data.user ?? ({} as User));
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated: !!user, logout, login, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
