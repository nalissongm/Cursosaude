import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

const schema = z.object({
  code: z.string().length(6, 'O código deve ter 6 dígitos'),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { updateOnboardingStep } = useAuth();
  const email = location.state?.email || 'seu e-mail';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await api.post('/users/onboarding/verify', values);
      updateOnboardingStep('PENDING_PROFILE');
      navigate('/onboarding/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido ou expirado. Verifique e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-[#1e40af]/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-[#1e40af] w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Confirme seu E-mail</CardTitle>
          <CardDescription className="text-base">
            Digite o código de 6 dígitos que enviamos para <span className="font-semibold text-gray-900">{email}</span>.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 flex flex-col items-center">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="text-center">
                    <FormLabel>Código de Verificação</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-12 h-14 text-xl border-gray-300" />
                          <InputOTPSlot index={1} className="w-12 h-14 text-xl border-gray-300" />
                          <InputOTPSlot index={2} className="w-12 h-14 text-xl border-gray-300" />
                          <InputOTPSlot index={3} className="w-12 h-14 text-xl border-gray-300" />
                          <InputOTPSlot index={4} className="w-12 h-14 text-xl border-gray-300" />
                          <InputOTPSlot index={5} className="w-12 h-14 text-xl border-gray-300" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-6 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verificar e Continuar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
