import { useState } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [cpfEmail, setCpfEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af]/90 to-[#10b981]/80 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1757125736482-328a3cdd9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHN0dWR5aW5nJTIwbWVkaWNhbCUyMGVkdWNhdGlvbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE0OTU3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Enfermeira estudando"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
          <h1 className="text-5xl mb-4 text-center">Sua jornada para a residência começa aqui</h1>
          <p className="text-xl text-center max-w-md opacity-90">
            Prepare-se com conteúdo de qualidade e conquiste sua vaga
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center">
                <span className="text-white">+</span>
              </div>
              <span className="text-2xl text-[#1e40af]">MedPrep</span>
            </div>
            <h2 className="text-3xl mb-2">Bem-vindo de volta</h2>
            <p className="text-[#64748b]">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="cpf-email" className="block mb-2 text-[#1e293b]">
                CPF ou E-mail
              </label>
              <input
                id="cpf-email"
                type="text"
                value={cpfEmail}
                onChange={(e) => setCpfEmail(e.target.value)}
                placeholder="Digite seu CPF ou e-mail"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-[#1e293b]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-[#1e40af] border-[#e2e8f0] rounded focus:ring-[#1e40af]" />
                <span className="ml-2 text-sm text-[#64748b]">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm text-[#1e40af] hover:underline">
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 shadow-lg shadow-[#1e40af]/20 hover:shadow-xl hover:shadow-[#1e40af]/30"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#e2e8f0]">
            <p className="text-center text-[#64748b] mb-4">
              Problemas para acessar?
            </p>
            <button className="w-full py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20 hover:shadow-xl hover:shadow-[#10b981]/30">
              <MessageCircle className="w-5 h-5" />
              Suporte via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
