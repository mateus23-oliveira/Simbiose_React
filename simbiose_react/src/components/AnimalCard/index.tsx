import { type Animal } from "../../interfaces/especie.interface";
import {
  Card, Thumb, DownloadBtn, Info,
  Name, Desc, Meta, MetaTag,
  Actions, EditBtn, DeleteBtn,
} from "./styles";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AnimalCard({ animal, onEdit, onDelete }: Props) {
  const imageUrl = animal.arquivo
    ? `http://localhost:3000/uploads/${animal.arquivo}`
    : null;

  async function handleDownload() {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${animal.nome.replace(/\s+/g, "_")}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Não foi possível baixar a imagem.");
    }
  }

  return (
    <Card>
      <div style={{ position: "relative" }}>
        <Thumb
          src={imageUrl || "https://placehold.co/600x380/0b1a0b/2d4a2d?text=Sem+imagem"}
          alt={animal.nome}
        />
        {imageUrl && (
          <DownloadBtn onClick={handleDownload} title="Baixar imagem">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </DownloadBtn>
        )}
      </div>

      <Info>
        <Name>{animal.nome}</Name>
        <Desc>{animal.descricao}</Desc>
        <Meta>
          {!!animal.habitat && <MetaTag>🌿 {animal.habitat}</MetaTag>}
          {!!animal.tempoVida && <MetaTag>⏳ {animal.tempoVida} anos</MetaTag>}
        </Meta>
        <Actions>
          <EditBtn onClick={onEdit}>Editar</EditBtn>
          <DeleteBtn onClick={onDelete}>Remover</DeleteBtn>
        </Actions>
      </Info>
    </Card>
  );
}