import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../../lib/axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';

export const RegisterEmailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/users/onboarding/email', { email });
      navigate('/onboarding/verify', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao registrar e-mail. Tente novamente.');
      console.error('Error registering email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1e40af]">Configurar E-mail</CardTitle>
          <CardDescription>
            Informe seu e-mail para continuar o processo de ativação da sua conta.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Continuar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
