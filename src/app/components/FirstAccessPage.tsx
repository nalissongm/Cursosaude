import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { ImageWithFallback } from './figma/ImageWithFallback';

const schema = z.object({
  identifier: z.string().min(1, 'Matrícula é obrigatória'),
  password: z.string().min(1, 'Senha temporária é obrigatória'),
});

type FormValues = z.infer<typeof schema>;

export function FirstAccessPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Dados incorretos. Verifique sua matrícula e senha temporária.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af]/90 to-[#10b981]/80 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1757125736482-328a3cdd9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHN0dWR5aW5nJTIwbWVkaWNhbCUyMGVkdWNhdGlvbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE0OTU3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="LMS Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
          <h1 className="text-5xl mb-4 text-center">Ativação de Conta</h1>
          <p className="text-xl text-center max-w-md opacity-90">Bem-vindo ao Cursosaude. Siga os passos para configurar seu perfil.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
            Voltar ao login
          </button>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Primeiro Acesso</h2>
            <p className="text-gray-500 mt-2">Ative sua conta de estudante.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite sua matrícula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Temporária</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha temporária"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-6 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Prosseguir'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
