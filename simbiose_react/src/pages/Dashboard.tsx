import { useEffect, useState } from "react";
import { crudService } from "../services/crud.service";
import { Especie } from "../types";
import { Button } from "../components/Button";

interface DashboardProps {
  onEditEspecie: (especie: Especie) => void;
  onDeleteEspecie: (id: string) => void;
  refresh: number;
}

export function Dashboard({ onEditEspecie, onDeleteEspecie, refresh }: DashboardProps) {
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarEspecies = async () => {
      try {
        setLoading(true);
        setError(null);
        const dados = await crudService.listarEspecies();
        setEspecies(dados);
      } catch (err) {
        setError("Erro ao carregar espécies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarEspecies();
  }, [refresh]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Lista de Espécies</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>⏳ Carregando...</p>
      ) : (
        <div>
          <p>
            <strong>Total: {especies.length} espécies</strong>
          </p>

          {especies.length === 0 ? (
            <p>Nenhuma espécie cadastrada</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={cellStyle}>Nome</th>
                  <th style={cellStyle}>Tempo de Vida</th>
                  <th style={cellStyle}>Habitat</th>
                  <th style={cellStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {especies.map((especie) => (
                  <tr key={especie._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={cellStyle}>{especie.nome}</td>
                    <td style={cellStyle}>{especie.tempoVida} anos</td>
                    <td style={cellStyle}>{especie.habitat}</td>
                    <td style={cellStyle}>
                      <Button
                        label="Editar"
                        onClick={() => onEditEspecie(especie)}
                      />
                      <Button
                        label="Deletar"
                        onClick={() => onDeleteEspecie(especie._id!)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const cellStyle = {
  padding: "10px",
  textAlign: "left" as const,
  borderBottom: "1px solid #ddd",
};