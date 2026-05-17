import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';

// 1. Schema de Validação com confirmação de senha
const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmacaoSenha: z.string()
}).refine((data) => data.senha === data.confirmacaoSenha, {
  message: "As senhas não coincidem",
  path: ["confirmacaoSenha"], // Aponta o erro especificamente para o campo de confirmação
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);

    try {
      // 2. Disparo para a API
      // Note que estamos enviando apenas o que o banco precisa, e adicionando o nível de acesso (role/tipo)
      const response = await api.post('/auth/registrar', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        role: 'admin' // <-- Aqui nós dizemos ao backend que este é um cadastro de Admin
      });

      console.log('Sucesso! Resposta da API:', response.data);
      alert('Administrador cadastrado com sucesso!');
      
      reset(); // Limpa o formulário após o sucesso

    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      
      if (err.response && err.response.status === 400) {
        alert("Erro no cadastro. O e-mail pode já estar em uso.");
      } else {
        alert("Erro de conexão com o servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Novo Administrador</h2>
          <p className="text-slate-500">Cadastre um novo usuário com privilégios de gestão.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Campo NOME */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Ana Silva"
              {...register('nome')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${
                errors.nome ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.nome && <span className="text-red-500 text-sm mt-1 block">{errors.nome.message}</span>}
          </div>

          {/* Campo E-MAIL */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@simbiose.com.br"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Campo SENHA */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1">
              Senha Inicial
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('senha')}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all pr-12 ${
                  errors.senha ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
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
            {errors.senha && <span className="text-red-500 text-sm mt-1 block">{errors.senha.message}</span>}
          </div>

          {/* Campo CONFIRMAÇÃO DE SENHA */}
          <div>
            <label htmlFor="confirmacaoSenha" className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Senha
            </label>
            <input
              id="confirmacaoSenha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmacaoSenha')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all ${
                errors.confirmacaoSenha ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.confirmacaoSenha && <span className="text-red-500 text-sm mt-1 block">{errors.confirmacaoSenha.message}</span>}
          </div>

          {/* BOTÃO SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Administrador'}
          </button>
        </form>
      </div>
    </div>
  );
}