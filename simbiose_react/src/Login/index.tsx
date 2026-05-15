import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';

// 1. Definimos o Schema de Validação com o Zod
const loginSchema = z.object({
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Extraímos o tipo do schema para o TypeScript ajudar no autocompletar
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Iniciamos o React Hook Form conectando com o Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Função que só será chamada se a validação do Zod passar
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      // Fazendo a requisição real para o backend Node.js na porta 3000
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password
      });

      console.log('Sucesso! Resposta da API:', response.data);
      
      // Quando o backend estiver 100% pronto, o código de sucesso entra aqui:
      // Ex: localStorage.setItem('token', response.data.token);
      // Ex: navigate('/dashboard');

    } catch (err: any) {
      console.error('Erro ao conectar com a API:', err);
      
      // Tratamento básico de erro para dar feedback na tela
      if (err.response && err.response.status === 401) {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Erro no servidor ou rota não encontrada. Verifique o backend.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo</h2>
          <p className="text-slate-500">Insira suas credenciais para acessar o sistema.</p>
        </div>

        {/* Passamos o handleSubmit do hook form encapsulando nossa função */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            {/* O register substitui o value e onChange */}
            <input
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {/* Exibição automática do erro gerado pelo Zod */}
            {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pr-12 ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}