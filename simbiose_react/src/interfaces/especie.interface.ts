export interface Animal {
  _id: string;
  nome: string;
  tempoVida: number;
  descricao: string;
  habitat: string;
  tipo?: string;
  arquivo?: string | null;
}