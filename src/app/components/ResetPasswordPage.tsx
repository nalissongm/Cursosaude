import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import axiosInstance from '../../lib/axios';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token de recuperação inválido ou expirado.');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword: data.password,
      });
      toast.success('Senha redefinida com sucesso! Agora você pode entrar.');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Link Inválido</h2>
          <p className="text-[#64748b] mb-6">Este link de recuperação de senha é inválido ou expirou.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all"
          >
            Solicitar novo link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Nova senha</h2>
          <p className="text-[#64748b]">Defina uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#1e293b]">
              Nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-[#f8fafc] border ${
                  errors.password ? 'border-red-500' : 'border-[#e2e8f0]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1e293b]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-[#1e293b]">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-[#f8fafc] border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#e2e8f0]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 shadow-lg shadow-[#1e40af]/20 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Redefinir senha'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
