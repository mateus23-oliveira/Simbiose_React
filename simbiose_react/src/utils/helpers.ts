// Funções utilitárias
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}