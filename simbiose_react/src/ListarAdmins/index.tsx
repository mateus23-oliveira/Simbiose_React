import { useEffect, useState } from 'react';
import { api } from '../services/api';

// Tipagem do que esperamos receber do MongoDB (repare no _id)
interface IUsuario {
  _id: string;
  nome: string;
  email: string;
  role: string;
}

export default function ListarAdmins() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pegamos a role de quem está acessando a tela agora
  const roleLogado = localStorage.getItem('userRole');

  // O useEffect roda automaticamente assim que a tela abre
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        // Rota hipotética do Node para listar todos. O seu colega precisará criar essa rota no backend.
        const response = await api.get('/usuarios'); 
        
        // Se a API não estiver pronta, você pode testar comentando a linha acima 
        // e descomentando os dados falsos (mock) abaixo:
        /*
        const response = { data: [
          { _id: '1', nome: 'Jhone Araujo', email: 'eco.jhone@gmail.com', role: 'master' },
          { _id: '2', nome: 'Ana Silva', email: 'admin@simbiose.com.br', role: 'admin' }
        ]};
        */

        setUsuarios(response.data);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        alert('Não foi possível carregar a lista. Verifique o servidor.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarUsuarios();
  }, []);

  // Função para simular a exclusão
  const handleExcluir = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${nome}?`)) return;

    try {
      // await api.delete(`/usuarios/${id}`); // Futura rota do Node
      
      // Atualiza a tela removendo o usuário da lista
      setUsuarios(usuarios.filter(user => user._id !== id));
      alert('Usuário excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir usuário.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Administradores</h2>
            <p className="text-slate-500">Gerencie os acessos ao sistema Simbiose.</p>
          </div>
          
          {/* Botão de Novo Admin (Só aparece se for master) */}
          {roleLogado === 'master' && (
            <button 
              onClick={() => window.location.href = '/registrar-admin'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              + Novo Administrador
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Carregando dados...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-semibold">Nome</th>
                    <th className="p-4 font-semibold">E-mail</th>
                    <th className="p-4 font-semibold text-center">Nível</th>
                    <th className="p-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-800 font-medium">{user.nome}</td>
                      <td className="p-4 text-slate-500">{user.email}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          user.role === 'master' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {/* Regra de Ouro: Só mostra as ações se quem está usando for master */}
                        {roleLogado === 'master' ? (
                          <div className="flex justify-center gap-3">
                            <button className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                              Editar
                            </button>
                            <button 
                              onClick={() => handleExcluir(user._id, user.nome)}
                              className="text-red-500 hover:text-red-700 font-medium transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-sm italic">Sem permissão</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        Nenhum administrador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}