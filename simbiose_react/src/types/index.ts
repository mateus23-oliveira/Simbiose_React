export interface Especie {
  _id?: string;
  nome: string;
  tempoVida: number;
  descricao: string;
  habitat: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface DashboardData {
  totalEspecies: number;
  ultimasAtualizacoes: Especie[];
}