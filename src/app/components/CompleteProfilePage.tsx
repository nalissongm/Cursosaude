import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { Loader2, UserCircle, Camera } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const schema = z.object({
  cpf: z.string().length(11, 'O CPF deve ter exatamente 11 dígitos'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export function CompleteProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateOnboardingStep } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cpf: '',
      dateOfBirth: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatarPreview(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await api.post('/users/onboarding/profile', {
        cpf: values.cpf,
        dateOfBirth: values.dateOfBirth,
        password: values.newPassword,
      });
      updateOnboardingStep('COMPLETED');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao completar perfil. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      <Card className="w-full max-w-lg shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-[#1e40af]/10 rounded-full flex items-center justify-center mb-4">
            <UserCircle className="text-[#1e40af] w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Complete seu Perfil</CardTitle>
          <CardDescription className="text-base">
            Último passo para acessar o portal do estudante.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Foto de Perfil (Opcional)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000000" maxLength={11} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defina uma Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme a Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite novamente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-6 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Finalizar e Acessar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
