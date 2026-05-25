//import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Login from './Login';
import RegisterAdmin from './RegisterAdmin';
import ListarAdmins from './ListarAdmins';

// Componente de segurança 
function RotaProtegidaMaster({ children }: { children: ReactNode }) {
  const role = localStorage.getItem('userRole');
  
  if (role === 'master') {
    return children;
  }
  
  alert('Acesso negado. Apenas usuários Master podem acessar esta tela.');
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública: Qualquer um acessa */}
        <Route path="/" element={<Login />} />
        
        {/* Rota protegida: Apenas Master pode cadastrar */}
        <Route 
          path="/registrar-admin" 
          element={
            <RotaProtegidaMaster>
              <RegisterAdmin />
            </RotaProtegidaMaster>
          } 
        />

        {/* Rota protegida: Apenas Master pode ver a lista */}
        <Route 
          path="/listar-admins" 
          element={
            <RotaProtegidaMaster>
              <ListarAdmins />
            </RotaProtegidaMaster>
          } 
        />

        {/* Rota de segurança: Redireciona rotas inexistentes para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}