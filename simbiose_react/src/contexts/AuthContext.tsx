import { useState } from "react";
import type { ReactNode } from "react";
import { loginRequest } from "../services/authService";
import type { LoginData, LoginResponse } from "../services/authService";
import { AuthContext } from "./authContextObject";

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredUser(): LoginResponse["usuario"] | null {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  return JSON.parse(storedUser);
}

function getStoredToken(): string | null {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<LoginResponse["usuario"] | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);

  const isAuthenticated = !!usuario && !!token;

  async function signIn(data: LoginData): Promise<void> {
    const response = await loginRequest(data);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.usuario));
    setToken(response.token);
    setUsuario(response.usuario);
  }

  function signOut(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}