import { createContext } from "react";
import type { LoginData, Usuario } from "../services/authService";

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);