import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { ModalCRUD } from "./components/ModalCRUD";
import { crudService } from "./services/crud.service";
import { Especie } from "./types";
import { Button } from "./components/Button";
import "./styles/global.css";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [especieSelecionada, setEspecieSelecionada] = useState<Especie | undefined>();
  const [refresh, setRefresh] = useState(0);

  const handleAbrirCriar = () => {
    setEspecieSelecionada(undefined);
    setIsModalOpen(true);
  };

  const handleAbrirEditar = (especie: Especie) => {
    setEspecieSelecionada(especie);
    setIsModalOpen(true);
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta espécie?")) {
      try {
        await crudService.deletarEspecie(id);
        setRefresh(refresh + 1);
      } catch (error) {
        alert("Erro ao deletar");
        console.error(error);
      }
    }
  };

  const handleSalvar = () => {
    setRefresh(refresh + 1);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
        <h1>🌍 Sistema de Gerenciamento de Espécies</h1>
        <Button
          label="➕ Criar Nova Espécie"
          onClick={handleAbrirCriar}
          style={{ backgroundColor: "#28a745" }}
        />
      </div>

      <Dashboard
        onEditEspecie={handleAbrirEditar}
        onDeleteEspecie={handleDeletar}
        refresh={refresh}
      />

      <ModalCRUD
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        especie={especieSelecionada}
        onSave={handleSalvar}
      />
    </div>
  );
}