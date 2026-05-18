import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// 1. Definimos o Schema de Validação com o Zod (Mantido do seu projeto atual)
const loginSchema = z.object({
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Adicionado para o redirecionamento funcionar

  // 2. Iniciamos o React Hook Form conectando com o Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Função de submissão (Mantida 100% com a sua lógica atual)
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        senha: data.password
      });

      console.log('Sucesso! Resposta da API:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.usuario.role);
      
      // Redireciona para o painel principal (você pode ajustar a rota depois)
      navigate('/listar-admins');

    } catch (err) {      
      const erroAxios = err as { response?: { status: number } };
      console.error('Erro ao conectar com a API:', err);
      
      if (erroAxios.response && erroAxios.response.status === 401) {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Erro no servidor ou rota não encontrada. Verifique o backend.");
      }    
    } finally {
      setIsLoading(false);
    }
  };

  // Caminho da imagem de fundo (coloque a imagem na pasta /public)
  const backgroundUrl = "/bg-login.jpg"; 

  return (
    <>
      {/* Estilo embutido para a animação de levitação do logotipo */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Imagem de Fundo (fixed inset-0 ocupando a tela toda) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      
      {/* Overlay Escuro para contraste e desfoque leve do fundo */}
      <div className="fixed inset-0 z-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Container Principal Centralizado */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
        
        {/* CARD COM GLASSMORPHISM */}
        <div className="w-full max-w-[380px] border border-white/20 shadow-2xl rounded-[2.5rem] bg-black/40 backdrop-blur-md p-6">
          
          {/* CABEÇALHO DO CARD */}
          <div className="flex flex-col items-center pb-4 pt-4">
            {/* O LOGOTIPO FLUTUANTE (coloque o logo.png na pasta /public) */}
            <img 
              src="/logo.png"
              alt="Logotipo Simbiose" 
              className="h-20 w-auto object-contain mb-3 drop-shadow-2xl animate-float" 
            />
            <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
              Insira suas informações
            </h2>
          </div>

          {/* FORMULÁRIO */}
          <div className="pb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1">
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full h-11 rounded-xl bg-white/90 border-2 border-transparent px-4 placeholder:text-slate-500 text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:outline-none transition-colors duration-300 text-sm shadow-inner"
                  {...register("email")} 
                  disabled={isLoading}
                />
                {errors.email && <span className="text-xs text-red-400 font-medium ml-1 drop-shadow-md">{errors.email.message}</span>}
              </div>
              
              <div className="space-y-1">
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="w-full h-11 rounded-xl bg-white/90 border-2 border-transparent px-4 pr-16 placeholder:text-slate-500 text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:outline-none transition-colors duration-300 text-sm shadow-inner"
                    {...register("password")} 
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 font-medium text-xs focus:outline-none"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-400 font-medium ml-1 drop-shadow-md">{errors.password.message}</span>}
              </div>

              <button 
                type="submit" 
                className="w-full flex justify-center items-center h-11 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-900/50 disabled:opacity-60 border border-emerald-500/50" 
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Acessar minha conta"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}