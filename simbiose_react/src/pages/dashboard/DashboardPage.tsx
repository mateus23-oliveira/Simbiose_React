import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { type Animal } from "../../interfaces/especie.interface";
import AnimalCard from "../../components/AnimalCard";
import {
  Page, TopBar, LogoArea, LogoText, TopBarRight,
  TopBarTag, LogoutBtn, Hero, HeroTitle, HeroSub,
  StatsRow, StatCard, StatValue, StatLabel,
  Toolbar, SearchBox, FilterSelect, ToolbarRight, GhostBtn, PrimaryBtn,
  Body, ResultsInfo, CardsGrid, EmptyState,
  Overlay, ModalBox, ModalHeader, ModalBody, ModalFooter,
  CloseButton, FormField, ErrorMsg, CancelBtn, SaveBtn, DangerBtn,
} from "./styles";

type ModalType = "create" | "edit" | "delete" | null;

interface FormData {
  nome: string;
  tempoVida: string;
  descricao: string;
  habitat: string;
  arquivo: File | null;
}

const emptyForm: FormData = { nome: "", tempoVida: "", descricao: "", habitat: "", arquivo: null };

export function DashboardPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterHabitat, setFilterHabitat] = useState("todos");
  const [sortBy, setSortBy] = useState("nome");

  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Animal | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/especies");
      setAnimals(data);
    } catch { /**/ }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  /* ── Derived ── */
  const habitats = ["todos", ...Array.from(new Set(animals.map((a) => a.habitat).filter(Boolean)))];

  const filtered = animals
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.nome?.toLowerCase().includes(q) || a.habitat?.toLowerCase().includes(q) || a.descricao?.toLowerCase().includes(q);
      const matchHabitat = filterHabitat === "todos" || a.habitat === filterHabitat;
      return matchSearch && matchHabitat;
    })
    .sort((a, b) => {
      if (sortBy === "nome") return a.nome.localeCompare(b.nome);
      if (sortBy === "vida") return (a.tempoVida ?? 0) - (b.tempoVida ?? 0);
      return 0;
    });

  const habitatCount = new Set(animals.map((a) => a.habitat).filter(Boolean)).size;

  /* ── Exportar CSV ── */
  function exportCSV() {
    const header = "Nome,Habitat,Tempo de Vida (anos),Descrição";
    const rows = filtered.map((a) =>
      `"${a.nome}","${a.habitat}","${a.tempoVida}","${a.descricao?.replace(/"/g, "'")}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "simbiose_animais.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  /* ── Modal helpers ── */
  function openCreate() { setForm(emptyForm); setError(""); setModal("create"); }
  function openEdit(a: Animal) { setSelected(a); setForm({ nome: a.nome, tempoVida: String(a.tempoVida), descricao: a.descricao, habitat: a.habitat, arquivo: null }); setError(""); setModal("edit"); }
  function openDelete(a: Animal) { setSelected(a); setError(""); setModal("delete"); }
  function close() { setModal(null); setSelected(null); setForm(emptyForm); setError(""); }

  /* ── CRUD ── */
  async function handleCreate() {
    if (!form.nome || !form.tempoVida || !form.descricao || !form.habitat) { setError("Preencha todos os campos."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("nome", form.nome); fd.append("tempoVida", form.tempoVida);
      fd.append("descricao", form.descricao); fd.append("habitat", form.habitat);
      if (form.arquivo) fd.append("arquivo", form.arquivo);
      await api.post("/especies", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await load(); close();
    } catch { setError("Erro ao criar. Tente novamente."); }
    finally { setSubmitting(false); }
  }

  async function handleEdit() {
    if (!selected || !form.nome || !form.tempoVida || !form.descricao || !form.habitat) { setError("Preencha todos os campos."); return; }
    setSubmitting(true);
    try {
      if (form.arquivo) {
        const fd = new FormData();
        fd.append("nome", form.nome); fd.append("tempoVida", form.tempoVida);
        fd.append("descricao", form.descricao); fd.append("habitat", form.habitat);
        fd.append("arquivo", form.arquivo);
        await api.put(`/especies/${selected._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.put(`/especies/${selected._id}`, { nome: form.nome, tempoVida: Number(form.tempoVida), descricao: form.descricao, habitat: form.habitat });
      }
      await load(); close();
    } catch { setError("Erro ao atualizar."); }
    finally { setSubmitting(false); }
  }

  async function handleDelete() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.delete(`/especies/${selected._id}`);
      await load(); close();
    } catch { setError("Erro ao excluir."); }
    finally { setSubmitting(false); }
  }

  function handleLogout() {
    signOut();
    navigate("/login");
  }

  return (
    <Page>
      {/* ── Google Fonts ── */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Top Bar ── */}
      <TopBar>
        <LogoArea>
          <img
            src="/simbiose.png"
            alt="SIMBiOSE"
            style={{ height: "38px", objectFit: "contain" }}
          />
          <LogoText>
            SIM<em>BiO</em>SE
          </LogoText>
        </LogoArea>
        <TopBarRight>
          <TopBarTag>ONG de proteção animal</TopBarTag>
          <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
        </TopBarRight>
      </TopBar>

      {/* ── Hero ── */}
      <Hero>
        <HeroTitle>
          Espécies em <span>Monitoramento</span>
        </HeroTitle>
        <HeroSub>
          Gerencie e acompanhe cada animal sob proteção da SIMBiOSE.
          Cada registro é um compromisso com a vida selvagem.
        </HeroSub>
        <StatsRow>
          <StatCard>
            <StatValue>{animals.length}</StatValue>
            <StatLabel>Animais</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{habitatCount}</StatValue>
            <StatLabel>Habitats</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {animals.length > 0
                ? Math.round(animals.reduce((s, a) => s + (a.tempoVida || 0), 0) / animals.length)
                : 0}
            </StatValue>
            <StatLabel>Média vida (anos)</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{filtered.length}</StatValue>
            <StatLabel>Exibindo</StatLabel>
          </StatCard>
        </StatsRow>
      </Hero>

      {/* ── Toolbar ── */}
      <Toolbar>
        <SearchBox>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Buscar por nome, habitat ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>

        <FilterSelect value={filterHabitat} onChange={(e) => setFilterHabitat(e.target.value)}>
          {habitats.map((h) => (
            <option key={h} value={h}>{h === "todos" ? "Todos os habitats" : h}</option>
          ))}
        </FilterSelect>

        <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="nome">Ordenar: A–Z</option>
          <option value="vida">Ordenar: Tempo de vida</option>
        </FilterSelect>

        <ToolbarRight>
          <GhostBtn onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar CSV
          </GhostBtn>
          <PrimaryBtn onClick={openCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Animal
          </PrimaryBtn>
        </ToolbarRight>
      </Toolbar>

      {/* ── Grid ── */}
      <Body>
        <ResultsInfo>
          {loading ? "carregando..." : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
        </ResultsInfo>

        {!loading && filtered.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: 48 }}>🌿</div>
            <p>{search || filterHabitat !== "todos" ? "Nenhum animal encontrado para esse filtro." : "Nenhum animal cadastrado ainda."}</p>
          </EmptyState>
        ) : (
          <CardsGrid>
            {filtered.map((animal) => (
              <AnimalCard
                key={animal._id}
                animal={animal}
                onEdit={() => openEdit(animal)}
                onDelete={() => openDelete(animal)}
              />
            ))}
          </CardsGrid>
        )}
      </Body>

      {/* ── Modal Criar / Editar ── */}
      {(modal === "create" || modal === "edit") && (
        <Overlay onClick={close}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{modal === "create" ? "Novo Animal" : "Editar Animal"}</h2>
              <CloseButton onClick={close}>✕</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormField>
                <label>Nome *</label>
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Onça-pintada" />
              </FormField>
              <FormField>
                <label>Tempo de vida (anos) *</label>
                <input type="number" value={form.tempoVida} onChange={(e) => setForm({ ...form, tempoVida: e.target.value })} placeholder="Ex: 15" />
              </FormField>
              <FormField>
                <label>Habitat *</label>
                <input value={form.habitat} onChange={(e) => setForm({ ...form, habitat: e.target.value })} placeholder="Ex: Floresta Amazônica" />
              </FormField>
              <FormField>
                <label>Descrição *</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva o animal..." />
              </FormField>
              <FormField>
                <label>Imagem{modal === "edit" ? " (deixe vazio para manter atual)" : ""}</label>
                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, arquivo: e.target.files?.[0] || null })} />
              </FormField>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <ModalFooter>
                <CancelBtn onClick={close}>Cancelar</CancelBtn>
                <SaveBtn onClick={modal === "create" ? handleCreate : handleEdit} disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar"}
                </SaveBtn>
              </ModalFooter>
            </ModalBody>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Modal Excluir ── */}
      {modal === "delete" && selected && (
        <Overlay onClick={close}>
          <ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <ModalHeader>
              <h2>Excluir Animal</h2>
              <CloseButton onClick={close}>✕</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ color: "#6b9a6b", lineHeight: 1.6, margin: 0 }}>
                Tem certeza que deseja remover{" "}
                <strong style={{ color: "white" }}>{selected.nome}</strong> do sistema?
                Essa ação é permanente.
              </p>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <ModalFooter>
                <CancelBtn onClick={close}>Cancelar</CancelBtn>
                <DangerBtn onClick={handleDelete} disabled={submitting}>
                  {submitting ? "Removendo..." : "Remover"}
                </DangerBtn>
              </ModalFooter>
            </ModalBody>
          </ModalBox>
        </Overlay>
      )}
    </Page>
  );
}