import { createContext } from "react";
import type { LoginData, LoginResponse } from "../services/authService";

interface AuthContextData {
  usuario: LoginResponse["usuario"] | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);