import api from "./api";

export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    _id: string;
    nome: string;
    email: string;
  };
}

export async function loginRequest(data: LoginData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}