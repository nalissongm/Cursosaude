import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';

export const CompleteProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    dateOfBirth: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateOnboardingStep } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real scenario, we'd use FormData for file upload
      const data = new FormData();
      data.append('cpf', formData.cpf);
      data.append('dateOfBirth', formData.dateOfBirth);
      if (avatar) {
        data.append('avatar', avatar);
      }

      await axiosInstance.post('/users/onboarding/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      updateOnboardingStep('COMPLETED');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao completar perfil. Verifique os dados.');
      console.error('Error completing profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1e40af]">Completar Perfil</CardTitle>
          <CardDescription>
            Precisamos de mais algumas informações para finalizar seu cadastro.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Foto de Perfil</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
              {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
