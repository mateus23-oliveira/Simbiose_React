import { useState, useEffect } from "react";
import { Especie } from "../types";
import { crudService } from "../services/crud.service";

interface ModalCRUDProps {
  isOpen: boolean;
  onClose: () => void;
  especie?: Especie;
  onSave: () => void;
}

export function ModalCRUD({ isOpen, onClose, especie, onSave }: ModalCRUDProps) {
  const [formData, setFormData] = useState<Especie>({
    nome: "",
    tempoVida: 0,
    descricao: "",
    habitat: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (especie) {
      setFormData(especie);
    } else {
      setFormData({
        nome: "",
        tempoVida: 0,
        descricao: "",
        habitat: "",
      });
    }
  }, [especie, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tempoVida" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (especie?._id) {
        await crudService.atualizarEspecie(especie._id, formData);
      } else {
        await crudService.criarEspecie(formData);
      }
      onSave();
    } catch (error) {
      alert("Erro ao salvar espécie");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>{especie ? "✏️ Editar Espécie" : "➕ Criar Nova Espécie"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome da Espécie"
            value={formData.nome}
            onChange={handleChange}
            required
            style={modalStyles.input}
          />
          <input
            type="number"
            name="tempoVida"
            placeholder="Tempo de Vida (anos)"
            value={formData.tempoVida}
            onChange={handleChange}
            required
            style={modalStyles.input}
          />
          <textarea
            name="descricao"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={handleChange}
            required
            style={modalStyles.textarea}
          />
          <input
            type="text"
            name="habitat"
            placeholder="Habitat"
            value={formData.habitat}
            onChange={handleChange}
            required
            style={modalStyles.input}
          />
          <div style={modalStyles.buttons}>
            <button
              type="submit"
              disabled={loading}
              style={modalStyles.buttonSave}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={modalStyles.buttonCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "100px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    fontFamily: "Arial, sans-serif",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  buttonSave: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  buttonCancel: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};