import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axiosInstance from '../../lib/axios';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/recover-password', data);
      setIsSent(true);
      toast.success('E-mail de recuperação enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <a 
            href="/login" 
            className="inline-flex items-center text-sm text-[#64748b] hover:text-[#1e40af] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </a>
          <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Recuperar senha</h2>
          <p className="text-[#64748b]">
            {isSent 
              ? 'Enviamos as instruções para o seu e-mail.' 
              : 'Digite seu e-mail para receber as instruções de recuperação.'}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#1e293b]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 bg-[#f8fafc] border ${
                    errors.email ? 'border-red-500' : 'border-[#e2e8f0]'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
                'Enviar instruções'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#f0f9ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#1e40af]" />
            </div>
            <p className="text-sm text-[#64748b] mb-6">
              Não recebeu o e-mail? Verifique sua caixa de spam ou tente novamente.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="text-[#1e40af] font-medium hover:underline"
            >
              Tentar outro e-mail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
