import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { Loader2, Mail } from 'lucide-react';
import api from '../../lib/axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const schema = z.object({
  email: z.string().email('Insira um e-mail válido'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterEmailPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await api.post('/users/onboarding/email', values);
      navigate('/onboarding/verify', { state: { email: values.email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao vincular e-mail. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-[#1e40af]/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-[#1e40af] w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Vincule seu E-mail</CardTitle>
          <CardDescription className="text-base">
            Para sua segurança, informe um e-mail válido que você tenha acesso.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} className="py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] py-6 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Continuar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
