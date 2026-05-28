import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { type Animal } from "../../interfaces/especie.interface";
import AnimalCard from "../../components/AnimalCard";
import {
  Page, TopBar, LogoArea, TopBarRight,
  TopBarTag, LogoutBtn, Hero, HeroTitle, HeroSub,
  StatsRow, StatCard, StatValue, StatLabel,
  Toolbar, SearchBox, FilterSelect, ToolbarRight, GhostBtn, PrimaryBtn,
  Body, ResultsInfo, CardsGrid, EmptyState,
  Overlay, ModalBox, ModalHeader, ModalBody, ModalFooter,
  CloseButton, FormField, ErrorMsg, CancelBtn, SaveBtn, DangerBtn,
} from "./styles";

/* ── tipos ── */
type AnimalModal = "create" | "edit" | "delete" | null;
type UsuarioView = "lista" | "form" | "delete";

interface FormAnimal {
  nome: string; tempoVida: string; descricao: string; habitat: string; arquivo: File | null;
}

interface UsuarioData {
  _id: string; nome: string; email: string; role: 'user' | 'admin';
}

interface FormUsuario {
  nome: string; email: string; senha: string; isAdmin: boolean;
}

const emptyAnimal: FormAnimal = { nome: "", tempoVida: "", descricao: "", habitat: "", arquivo: null };
const emptyFormUsuario: FormUsuario = { nome: "", email: "", senha: "", isAdmin: false };

export function DashboardPage() {
  const navigate = useNavigate();
  const { signOut, usuario } = useAuth();

  /* ── animais ── */
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterHabitat, setFilterHabitat] = useState("todos");
  const [sortBy, setSortBy] = useState("nome");

  /* ── modal animais ── */
  const [animalModal, setAnimalModal] = useState<AnimalModal>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [formAnimal, setFormAnimal] = useState<FormAnimal>(emptyAnimal);

  /* ── modal usuários ── */
  const [modalUsuarios, setModalUsuarios] = useState(false);
  const [usuarioView, setUsuarioView] = useState<UsuarioView>("lista");
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioData | null>(null);
  const [formUsuario, setFormUsuario] = useState<FormUsuario>(emptyFormUsuario);

  /* ── shared ── */
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ── load animais ── */
  async function loadAnimals() {
    setLoading(true);
    try { const { data } = await api.get("/especies"); setAnimals(data); }
    catch { /**/ } finally { setLoading(false); }
  }

  useEffect(() => { loadAnimals(); }, []);

  /* ── load usuários ── */
  async function loadUsuarios() {
    setLoadingUsuarios(true);
    try { const { data } = await api.get("/auth/usuarios"); setUsuarios(data); }
    catch { /**/ } finally { setLoadingUsuarios(false); }
  }

  /* ── derived ── */
  const habitats = ["todos", ...Array.from(new Set(animals.map((a) => a.habitat).filter(Boolean)))];
  const habitatCount = new Set(animals.map((a) => a.habitat).filter(Boolean)).size;

  const filtered = animals
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.nome?.toLowerCase().includes(q) || a.habitat?.toLowerCase().includes(q) || a.descricao?.toLowerCase().includes(q);
      const matchHabitat = filterHabitat === "todos" || a.habitat === filterHabitat;
      return matchSearch && matchHabitat;
    })
    .sort((a, b) => sortBy === "nome" ? a.nome.localeCompare(b.nome) : (a.tempoVida ?? 0) - (b.tempoVida ?? 0));

  /* ── csv ── */
  function exportCSV() {
    const header = "Nome,Habitat,Tempo de Vida (anos),Descrição";
    const rows = filtered.map((a) => `"${a.nome}","${a.habitat}","${a.tempoVida}","${a.descricao?.replace(/"/g, "'")}"`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "simbiose_animais.csv"; link.click();
    URL.revokeObjectURL(url);
  }

  /* ── helpers animais ── */
  function openCreateAnimal() { setFormAnimal(emptyAnimal); setError(""); setAnimalModal("create"); }
  function openEditAnimal(a: Animal) { setSelectedAnimal(a); setFormAnimal({ nome: a.nome, tempoVida: String(a.tempoVida), descricao: a.descricao, habitat: a.habitat, arquivo: null }); setError(""); setAnimalModal("edit"); }
  function openDeleteAnimal(a: Animal) { setSelectedAnimal(a); setError(""); setAnimalModal("delete"); }
  function closeAnimalModal() { setAnimalModal(null); setSelectedAnimal(null); setFormAnimal(emptyAnimal); setError(""); }

  /* ── helpers usuários ── */
  function openModalUsuarios() {
    setModalUsuarios(true);
    setUsuarioView("lista");
    setError("");
    loadUsuarios();
  }

  function closeModalUsuarios() {
    setModalUsuarios(false);
    setUsuarioView("lista");
    setSelectedUsuario(null);
    setFormUsuario(emptyFormUsuario);
    setError("");
  }

  function openNovoUsuario() {
    setFormUsuario(emptyFormUsuario);
    setSelectedUsuario(null);
    setError("");
    setUsuarioView("form");
  }

  function openEditUsuario(u: UsuarioData) {
    setSelectedUsuario(u);
    setFormUsuario({ nome: u.nome, email: u.email, senha: "", isAdmin: u.role === "admin" });
    setError("");
    setUsuarioView("form");
  }

  function openDeleteUsuario(u: UsuarioData) {
    setSelectedUsuario(u);
    setError("");
    setUsuarioView("delete");
  }

  function voltarLista() {
    setUsuarioView("lista");
    setSelectedUsuario(null);
    setFormUsuario(emptyFormUsuario);
    setError("");
  }

  /* ── CRUD animais ── */
  async function handleCreateAnimal() {
    if (!formAnimal.nome || !formAnimal.tempoVida || !formAnimal.descricao || !formAnimal.habitat) { setError("Preencha todos os campos."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("nome", formAnimal.nome); fd.append("tempoVida", formAnimal.tempoVida);
      fd.append("descricao", formAnimal.descricao); fd.append("habitat", formAnimal.habitat);
      if (formAnimal.arquivo) fd.append("arquivo", formAnimal.arquivo);
      await api.post("/especies", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await loadAnimals(); closeAnimalModal();
    } catch { setError("Erro ao criar. Tente novamente."); } finally { setSubmitting(false); }
  }

  async function handleEditAnimal() {
    if (!selectedAnimal || !formAnimal.nome || !formAnimal.tempoVida || !formAnimal.descricao || !formAnimal.habitat) { setError("Preencha todos os campos."); return; }
    setSubmitting(true);
    try {
      if (formAnimal.arquivo) {
        const fd = new FormData();
        fd.append("nome", formAnimal.nome); fd.append("tempoVida", formAnimal.tempoVida);
        fd.append("descricao", formAnimal.descricao); fd.append("habitat", formAnimal.habitat);
        fd.append("arquivo", formAnimal.arquivo);
        await api.put(`/especies/${selectedAnimal._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.put(`/especies/${selectedAnimal._id}`, { nome: formAnimal.nome, tempoVida: Number(formAnimal.tempoVida), descricao: formAnimal.descricao, habitat: formAnimal.habitat });
      }
      await loadAnimals(); closeAnimalModal();
    } catch { setError("Erro ao atualizar."); } finally { setSubmitting(false); }
  }

  async function handleDeleteAnimal() {
    if (!selectedAnimal) return;
    setSubmitting(true);
    try { await api.delete(`/especies/${selectedAnimal._id}`); await loadAnimals(); closeAnimalModal(); }
    catch { setError("Erro ao excluir."); } finally { setSubmitting(false); }
  }

  /* ── CRUD usuários ── */
  async function handleSalvarUsuario() {
    if (!formUsuario.nome || !formUsuario.email) { setError("Preencha nome e e-mail."); return; }
    if (!selectedUsuario && !formUsuario.senha) { setError("Informe uma senha para o novo usuário."); return; }

    setSubmitting(true);
    try {
      const payload: any = {
        nome: formUsuario.nome,
        email: formUsuario.email,
        role: formUsuario.isAdmin ? "admin" : "user",
      };
      if (formUsuario.senha.trim()) payload.senha = formUsuario.senha;

      if (selectedUsuario) {
        await api.put(`/auth/usuarios/${selectedUsuario._id}`, payload);
      } else {
        await api.post("/auth/registrar", payload);
      }

      await loadUsuarios();
      voltarLista();
    } catch (err: any) {
      setError(err.response?.data?.erro || "Erro ao salvar usuário.");
    } finally { setSubmitting(false); }
  }

  async function handleDeleteUsuario() {
    if (!selectedUsuario) return;
    setSubmitting(true);
    try {
      await api.delete(`/auth/usuarios/${selectedUsuario._id}`);
      await loadUsuarios();
      voltarLista();
    } catch (err: any) {
      setError(err.response?.data?.erro || "Erro ao remover usuário.");
    } finally { setSubmitting(false); }
  }

  function handleLogout() { signOut(); navigate("/login"); }

  /* ── render ── */
  return (
    <Page>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Top Bar ── */}
      <TopBar>
        <LogoArea>
          <img src="/simbiose.png" alt="SIMBiOSE" style={{ height: "38px", objectFit: "contain" }} />
        </LogoArea>
        <TopBarRight>
          <TopBarTag>👤 {usuario?.nome ?? "Usuário"}</TopBarTag>

          {usuario?.role === "admin" && (
            <GhostBtn onClick={openModalUsuarios}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Usuários
            </GhostBtn>
          )}

          <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
        </TopBarRight>
      </TopBar>

      {/* ── Hero ── */}
      <Hero>
        <HeroTitle>Espécies em <span>cuidado</span></HeroTitle>
        <HeroSub>Gerencie e acompanhe cada animal sob proteção da SIMBiOSE. Cada registro é um compromisso com a vida selvagem.</HeroSub>
        <StatsRow>
          <StatCard><StatValue>{animals.length}</StatValue><StatLabel>Animais</StatLabel></StatCard>
          <StatCard><StatValue>{habitatCount}</StatValue><StatLabel>Habitats</StatLabel></StatCard>
          <StatCard>
            <StatValue>{animals.length > 0 ? Math.round(animals.reduce((s, a) => s + (a.tempoVida || 0), 0) / animals.length) : 0}</StatValue>
            <StatLabel>Média vida (anos)</StatLabel>
          </StatCard>
          <StatCard><StatValue>{filtered.length}</StatValue><StatLabel>Exibindo</StatLabel></StatCard>
        </StatsRow>
      </Hero>

      {/* ── Toolbar ── */}
      <Toolbar>
        <SearchBox>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Buscar por nome, habitat ou descrição..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </SearchBox>

        <FilterSelect value={filterHabitat} onChange={(e) => setFilterHabitat(e.target.value)}>
          {habitats.map((h) => <option key={h} value={h}>{h === "todos" ? "Todos os habitats" : h}</option>)}
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
          <PrimaryBtn onClick={openCreateAnimal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Animal
          </PrimaryBtn>
        </ToolbarRight>
      </Toolbar>

      {/* ── Grid ── */}
      <Body>
        <ResultsInfo>{loading ? "carregando..." : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}</ResultsInfo>

        {!loading && filtered.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: 48 }}>🌿</div>
            <p>{search || filterHabitat !== "todos" ? "Nenhum animal encontrado para esse filtro." : "Nenhum animal cadastrado ainda."}</p>
          </EmptyState>
        ) : (
          <CardsGrid>
            {filtered.map((animal) => (
              <AnimalCard key={animal._id} animal={animal} onEdit={() => openEditAnimal(animal)} onDelete={() => openDeleteAnimal(animal)} />
            ))}
          </CardsGrid>
        )}
      </Body>

      {/* ════════════════════════════════════
          MODAIS ANIMAIS
      ════════════════════════════════════ */}

      {(animalModal === "create" || animalModal === "edit") && (
        <Overlay onClick={closeAnimalModal}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{animalModal === "create" ? "Novo Animal" : "Editar Animal"}</h2>
              <CloseButton onClick={closeAnimalModal}>✕</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormField><label>Nome *</label><input value={formAnimal.nome} onChange={(e) => setFormAnimal({ ...formAnimal, nome: e.target.value })} placeholder="Ex: Onça-pintada" /></FormField>
              <FormField><label>Tempo de vida (anos) *</label><input type="number" value={formAnimal.tempoVida} onChange={(e) => setFormAnimal({ ...formAnimal, tempoVida: e.target.value })} placeholder="Ex: 15" /></FormField>
              <FormField><label>Habitat *</label><input value={formAnimal.habitat} onChange={(e) => setFormAnimal({ ...formAnimal, habitat: e.target.value })} placeholder="Ex: Floresta Amazônica" /></FormField>
              <FormField><label>Descrição *</label><textarea value={formAnimal.descricao} onChange={(e) => setFormAnimal({ ...formAnimal, descricao: e.target.value })} placeholder="Descreva o animal..." /></FormField>
              <FormField>
                <label>Imagem{animalModal === "edit" ? " (deixe vazio para manter atual)" : ""}</label>
                <input type="file" accept="image/*" onChange={(e) => setFormAnimal({ ...formAnimal, arquivo: e.target.files?.[0] || null })} />
              </FormField>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <ModalFooter>
                <CancelBtn onClick={closeAnimalModal}>Cancelar</CancelBtn>
                <SaveBtn onClick={animalModal === "create" ? handleCreateAnimal : handleEditAnimal} disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</SaveBtn>
              </ModalFooter>
            </ModalBody>
          </ModalBox>
        </Overlay>
      )}

      {animalModal === "delete" && selectedAnimal && (
        <Overlay onClick={closeAnimalModal}>
          <ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <ModalHeader>
              <h2>Excluir Animal</h2>
              <CloseButton onClick={closeAnimalModal}>✕</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ color: "#6b9a6b", lineHeight: 1.6, margin: 0 }}>
                Tem certeza que deseja remover <strong style={{ color: "white" }}>{selectedAnimal.nome}</strong>? Essa ação é permanente.
              </p>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <ModalFooter>
                <CancelBtn onClick={closeAnimalModal}>Cancelar</CancelBtn>
                <DangerBtn onClick={handleDeleteAnimal} disabled={submitting}>{submitting ? "Removendo..." : "Remover"}</DangerBtn>
              </ModalFooter>
            </ModalBody>
          </ModalBox>
        </Overlay>
      )}

      {/* ════════════════════════════════════
          MODAL USUÁRIOS (CRUD completo)
      ════════════════════════════════════ */}

      {modalUsuarios && (
        <Overlay onClick={closeModalUsuarios}>
          <ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>

            {/* ── Lista ── */}
            {usuarioView === "lista" && (
              <>
                <ModalHeader>
                  <h2>Usuários cadastrados</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <SaveBtn onClick={openNovoUsuario} style={{ padding: "6px 14px", fontSize: 12 }}>+ Novo</SaveBtn>
                    <CloseButton onClick={closeModalUsuarios}>✕</CloseButton>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {loadingUsuarios ? (
                    <p style={{ color: "#3d5c3d", textAlign: "center", padding: "32px 0", margin: 0 }}>Carregando...</p>
                  ) : usuarios.length === 0 ? (
                    <p style={{ color: "#3d5c3d", textAlign: "center", padding: "32px 0", margin: 0 }}>Nenhum usuário encontrado.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {usuarios.map((u) => (
                        <div key={u._id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "#0f1f0f", border: "1px solid #1a2e1a", borderRadius: 10, padding: "12px 16px",
                        }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                              {u.nome}{u._id === usuario?._id ? " (você)" : ""}
                            </span>
                            <span style={{ color: "#3d5c3d", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{u.email}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                              padding: "3px 10px", borderRadius: 20, fontSize: 11,
                              fontFamily: "'DM Mono', monospace", fontWeight: 700, textTransform: "uppercase",
                              ...(u.role === "admin"
                                ? { background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }
                                : { background: "rgba(148,163,184,0.08)", color: "#64748b", border: "1px solid rgba(148,163,184,0.1)" })
                            }}>
                              {u.role}
                            </span>
                            <button onClick={() => openEditUsuario(u)} style={{ background: "transparent", border: "1px solid #1a2e1a", borderRadius: 8, color: "#6b9a6b", padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "0.2s" }}
                              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "white"; (e.target as HTMLElement).style.borderColor = "#4ade80"; }}
                              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#6b9a6b"; (e.target as HTMLElement).style.borderColor = "#1a2e1a"; }}>
                              Editar
                            </button>
                            {u._id !== usuario?._id && (
                              <button onClick={() => openDeleteUsuario(u)} style={{ background: "rgba(153,27,27,0.1)", border: "none", borderRadius: 8, color: "#f87171", padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "0.2s" }}
                                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(153,27,27,0.2)"; }}
                                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(153,27,27,0.1)"; }}>
                                Remover
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ModalBody>
              </>
            )}

            {/* ── Formulário criar / editar ── */}
            {usuarioView === "form" && (
              <>
                <ModalHeader>
                  <h2>{selectedUsuario ? "Editar Usuário" : "Novo Usuário"}</h2>
                  <CloseButton onClick={closeModalUsuarios}>✕</CloseButton>
                </ModalHeader>
                <ModalBody>
                  <FormField><label>Nome *</label><input value={formUsuario.nome} onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })} placeholder="Ex: Ana Silva" /></FormField>
                  <FormField><label>E-mail *</label><input type="email" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} placeholder="ana@simbiose.com" /></FormField>
                  <FormField>
                    <label>Senha{selectedUsuario ? " (deixe vazio para manter atual)" : " *"}</label>
                    <input type="password" value={formUsuario.senha} onChange={(e) => setFormUsuario({ ...formUsuario, senha: e.target.value })} placeholder="Mínimo 6 caracteres" />
                  </FormField>

                  <div onClick={() => setFormUsuario({ ...formUsuario, isAdmin: !formUsuario.isAdmin })}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f1f0f", border: "1px solid #1a2e1a", borderRadius: 10, padding: "12px 14px", cursor: "pointer", userSelect: "none" }}>
                    <span style={{ color: "#6b9a6b", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Usuário administrador</span>
                    <div style={{ width: 40, height: 22, borderRadius: 11, background: formUsuario.isAdmin ? "#16a34a" : "#1a2e1a", position: "relative", transition: "0.2s" }}>
                      <div style={{ position: "absolute", top: 3, left: formUsuario.isAdmin ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "0.2s" }} />
                    </div>
                  </div>

                  {error && <ErrorMsg>{error}</ErrorMsg>}
                  <ModalFooter>
                    <CancelBtn onClick={voltarLista}>Voltar</CancelBtn>
                    <SaveBtn onClick={handleSalvarUsuario} disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</SaveBtn>
                  </ModalFooter>
                </ModalBody>
              </>
            )}

            {/* ── Confirmar exclusão ── */}
            {usuarioView === "delete" && selectedUsuario && (
              <>
                <ModalHeader>
                  <h2>Remover Usuário</h2>
                  <CloseButton onClick={closeModalUsuarios}>✕</CloseButton>
                </ModalHeader>
                <ModalBody>
                  <p style={{ color: "#6b9a6b", lineHeight: 1.6, margin: 0 }}>
                    Tem certeza que deseja remover <strong style={{ color: "white" }}>{selectedUsuario.nome}</strong>? Essa ação é permanente.
                  </p>
                  {error && <ErrorMsg>{error}</ErrorMsg>}
                  <ModalFooter>
                    <CancelBtn onClick={voltarLista}>Voltar</CancelBtn>
                    <DangerBtn onClick={handleDeleteUsuario} disabled={submitting}>{submitting ? "Removendo..." : "Remover"}</DangerBtn>
                  </ModalFooter>
                </ModalBody>
              </>
            )}

          </ModalBox>
        </Overlay>
      )}
    </Page>
  );
}