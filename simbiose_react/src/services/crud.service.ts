const API_BASE = "http://localhost:3000";

export const crudService = {
  async listarEspecies() {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Erro ao listar espécies");
    return response.json();
  },

  async buscarEspeciePorId(id: string) {
    const response = await fetch(`${API_BASE}/users/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar espécie");
    return response.json();
  },

  async criarEspecie(especie: {
    nome: string;
    tempoVida: number;
    descricao: string;
    habitat: string;
  }) {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(especie),
    });
    if (!response.ok) throw new Error("Erro ao criar espécie");
    return response.json();
  },

  async atualizarEspecie(
    id: string,
    especie: {
      nome: string;
      tempoVida: number;
      descricao: string;
      habitat: string;
    }
  ) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(especie),
    });
    if (!response.ok) throw new Error("Erro ao atualizar espécie");
    return response.json();
  },

  async deletarEspecie(id: string) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar espécie");
    return response.json();
  },
};