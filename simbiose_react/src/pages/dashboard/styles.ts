import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Página ── */
export const Page = styled.div`
  min-height: 100vh;
  background: #050e05;
  font-family: 'DM Sans', sans-serif;
`;

/* ── Cabeçalho ── */
export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(5, 14, 5, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #1a2e1a;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
`;

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;


export const LogoText = styled.span`
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  letter-spacing: 0.05em;
  color: white;

  em {
    font-style: normal;
    color: #4ade80;
  }
`;

export const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TopBarTag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 20px;
  padding: 4px 12px;
`;

export const LogoutBtn = styled.button`
  background: transparent;
  border: 1px solid #1e3a1e;
  border-radius: 10px;
  color: #6b7280;
  font-size: 13px;
  padding: 8px 16px;
  cursor: pointer;
  transition: 0.2s;
  font-family: 'DM Sans', sans-serif;

  &:hover {
    border-color: #4ade80;
    color: #4ade80;
  }
`;

/* ── Hero ── */
export const Hero = styled.section`
  padding: 56px 48px 40px;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(74,222,128,0.12) 0%, transparent 65%);
  border-bottom: 1px solid #0f1f0f;
  animation: ${fadeUp} 0.5s ease both;
`;

export const HeroTitle = styled.h1`
  font-family: 'DM Mono', monospace;
  font-size: clamp(32px, 4vw, 52px);
  color: white;
  margin: 0 0 10px;
  letter-spacing: -0.02em;

  span {
    color: #4ade80;
  }
`;

export const HeroSub = styled.p`
  color: #4b6b4b;
  font-size: 15px;
  margin: 0 0 36px;
  max-width: 520px;
  line-height: 1.6;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  background: #0b1a0b;
  border: 1px solid #1a2e1a;
  border-radius: 14px;
  padding: 16px 24px;
  min-width: 140px;

  p {
    margin: 0;
    font-family: 'DM Mono', monospace;
  }
`;

export const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #4ade80;
  line-height: 1;
  margin-bottom: 4px !important;
`;

export const StatLabel = styled.p`
  font-size: 12px;
  color: #3d5c3d;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

/* ── Toolbar ── */
export const Toolbar = styled.div`
  padding: 24px 48px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid #0f1f0f;
  animation: ${fadeUp} 0.5s 0.1s ease both;
`;

export const SearchBox = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;

  input {
    width: 100%;
    background: #0b1a0b;
    border: 1px solid #1a2e1a;
    border-radius: 12px;
    padding: 11px 16px 11px 40px;
    color: white;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border 0.2s;
    box-sizing: border-box;

    &:focus { border-color: #4ade80; }
    &::placeholder { color: #2d4a2d; }
  }

  svg {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #2d4a2d;
  }
`;

export const FilterSelect = styled.select`
  background: #0b1a0b;
  border: 1px solid #1a2e1a;
  border-radius: 12px;
  padding: 11px 16px;
  color: #8ba88b;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  outline: none;
  transition: border 0.2s;

  &:focus { border-color: #4ade80; }
  option { background: #0b1a0b; }
`;

export const ToolbarRight = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

export const GhostBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid #1a2e1a;
  border-radius: 12px;
  color: #6b9a6b;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #4ade80;
    color: #4ade80;
  }
`;

export const PrimaryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: #16a34a;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover { background: #15803d; }
`;

/* ── Grid ── */
export const Body = styled.main`
  padding: 32px 48px 64px;
  animation: ${fadeUp} 0.5s 0.15s ease both;
`;

export const ResultsInfo = styled.p`
  color: #3d5c3d;
  font-size: 13px;
  margin: 0 0 20px;
  font-family: 'DM Mono', monospace;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 100px 0;

  p {
    color: #2d4a2d;
    font-size: 15px;
    margin-top: 12px;
  }
`;

/* ── Modais ── */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
`;

export const ModalBox = styled.div`
  background: #0b1a0b;
  border: 1px solid #1a2e1a;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  animation: ${fadeUp} 0.25s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 0;

  h2 {
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: #112211;
  border: none;
  color: #4b6b4b;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;

  &:hover { color: white; background: #1a2e1a; }
`;

export const ModalBody = styled.div`
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    color: #4b6b4b;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'DM Mono', monospace;
  }

  input, textarea {
    background: #0f1f0f;
    border: 1px solid #1a2e1a;
    border-radius: 10px;
    padding: 11px 14px;
    color: white;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border 0.2s;

    &:focus { border-color: #4ade80; }
    &::placeholder { color: #2d4a2d; }
  }

  input[type="file"] {
    padding: 10px 14px;
    color: #4b6b4b;
    cursor: pointer;
  }

  textarea {
    resize: vertical;
    min-height: 85px;
  }
`;

export const ErrorMsg = styled.p`
  color: #f87171;
  font-size: 13px;
  background: rgba(248,113,113,0.07);
  border: 1px solid rgba(248,113,113,0.15);
  padding: 10px 14px;
  border-radius: 8px;
  margin: 0;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

export const CancelBtn = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #1a2e1a;
  background: transparent;
  color: #4b6b4b;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: 0.2s;
  &:hover { color: white; background: #112211; }
`;

export const SaveBtn = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: #16a34a;
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: 0.2s;
  &:hover:not(:disabled) { background: #15803d; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const DangerBtn = styled(SaveBtn)`
  background: #991b1b;
  &:hover:not(:disabled) { background: #7f1d1d; }
`;