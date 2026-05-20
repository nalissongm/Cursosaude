import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axiosInstance from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

export const VerifyEmailPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { updateOnboardingStep } = useAuth();
  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/users/onboarding/verify', { code });
      updateOnboardingStep('PENDING_PROFILE');
      navigate('/onboarding/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido ou expirado.');
      console.error('Error verifying email:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1e40af]">Verificar E-mail</CardTitle>
          <CardDescription>
            Enviamos um código de 6 dígitos para {email || 'seu e-mail'}. Digite-o abaixo.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="space-y-2 w-full">
              <Label htmlFor="code" className="text-center block">Código de Verificação</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 w-full text-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]" 
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? 'Verificando...' : 'Verificar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
