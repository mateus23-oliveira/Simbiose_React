import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  senha: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginFormInputs) {
    try {
      setServerError('');
      await signIn(data);
      navigate('/app/dashboard');
    } catch (err: any) {
      console.error('Erro ao conectar com a API:', err);
      if (err.response && err.response.status === 401) {
        setServerError('E-mail ou senha incorretos.');
      } else {
        setServerError('Erro no servidor ou rota não encontrada. Verifique o backend.');
      }
    }
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* Fundo */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-login.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Conteúdo */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
        <div className="w-full max-w-[380px] border border-white/20 shadow-2xl rounded-[2.5rem] bg-black/40 backdrop-blur-md p-6">

          {/* Logo */}
          <div className="flex flex-col items-center pb-4 pt-4">
            <img
              src="/logo.png"
              alt="Logotipo SIMBiOSE"
              className="h-20 w-auto object-contain mb-3 drop-shadow-2xl animate-float"
            />
            <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
              Insira suas informações
            </h2>
          </div>

          {/* Formulário */}
          <div className="pb-4">
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">

              <div className="space-y-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Seu e-mail"
                  {...register('email')}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-white/90 border-2 border-transparent px-4 placeholder:text-slate-500 text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:outline-none transition-colors duration-300 text-sm shadow-inner"
                />
                {errors.email && (
                  <span className="text-xs text-red-400 font-medium ml-1 drop-shadow-md">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    {...register('senha')}
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-white/90 border-2 border-transparent px-4 pr-16 placeholder:text-slate-500 text-slate-900 focus-visible:border-emerald-500 focus-visible:ring-0 focus-visible:outline-none transition-colors duration-300 text-sm shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 font-medium text-xs focus:outline-none"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errors.senha && (
                  <span className="text-xs text-red-400 font-medium ml-1 drop-shadow-md">
                    {errors.senha.message}
                  </span>
                )}
              </div>

              {serverError && (
                <p className="text-xs text-red-400 font-medium text-center drop-shadow-md bg-red-950/40 border border-red-500/20 rounded-xl px-3 py-2">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center h-11 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-900/50 disabled:opacity-60 border border-emerald-500/50"
              >
                {isSubmitting ? 'Autenticando...' : 'Acessar minha conta'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}