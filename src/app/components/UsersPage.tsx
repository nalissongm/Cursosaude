import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User, 
  GraduationCap, 
  Key, 
  Trash2,
  Mail,
  Filter
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './ui/table';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import api from '../../lib/axios';
import { toast } from 'sonner';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  createdAt: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handlePasswordReset = async (email: string) => {
    try {
      await api.post('/auth/recover-password', { email });
      toast.success('E-mail de recuperação enviado com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar e-mail de recuperação');
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      toast.success('Cargo atualizado com sucesso');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao atualizar cargo');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="default" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Admin</Badge>;
      case 'INSTRUCTOR':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Instrutor</Badge>;
      default:
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Aluno</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Gestão de Usuários</h1>
          <p className="text-[#64748b]">Gerencie os perfis, permissões e acessos da plataforma.</p>
        </div>
        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2 h-11 px-6 shadow-lg shadow-[#1e40af]/20">
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#64748b]" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e40af] shadow-sm text-sm"
          >
            <option value="all">Todos os cargos</option>
            <option value="ADMIN">Administradores</option>
            <option value="INSTRUCTOR">Instrutores</option>
            <option value="STUDENT">Alunos</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl shadow-slate-200/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f8fafc]">
            <TableRow className="hover:bg-transparent border-b border-[#e2e8f0]">
              <TableHead className="font-semibold text-[#1e293b] py-5 pl-6">Nome Completo</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">E-mail</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">Cargo</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">Cadastro</TableHead>
              <TableHead className="w-[100px] py-5 pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6 py-4"><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-64" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell className="pr-6 py-4"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-[#64748b]">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <User className="w-12 h-12 text-[#cbd5e1]" />
                    <p>Nenhum usuário encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-[#f1f5f9]/50 transition-colors border-b border-[#e2e8f0]">
                  <TableCell className="pl-6 py-4 font-medium text-[#1e293b]">{user.fullName}</TableCell>
                  <TableCell className="py-4 text-[#64748b]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="py-4 text-[#64748b]">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-white hover:shadow-md transition-all">
                          <MoreVertical className="w-5 h-5 text-[#64748b]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-[#e2e8f0] shadow-xl">
                        <DropdownMenuLabel className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider px-2 py-2">
                          Ações do Usuário
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePasswordReset(user.email)} className="rounded-lg cursor-pointer gap-2 py-2.5">
                          <Key className="w-4 h-4" />
                          <span>Resetar Senha</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-[#f1f5f9]" />
                        <DropdownMenuLabel className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider px-2 py-2">
                          Alterar Cargo
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'ADMIN')} className="rounded-lg cursor-pointer gap-2 py-2.5">
                          <Shield className="w-4 h-4 text-red-500" />
                          <span>Tornar Admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'INSTRUCTOR')} className="rounded-lg cursor-pointer gap-2 py-2.5">
                          <GraduationCap className="w-4 h-4 text-blue-500" />
                          <span>Tornar Instrutor</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'STUDENT')} className="rounded-lg cursor-pointer gap-2 py-2.5">
                          <User className="w-4 h-4 text-emerald-500" />
                          <span>Tornar Aluno</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-[#f1f5f9]" />
                        <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 font-medium">
                          <Trash2 className="w-4 h-4" />
                          <span>Excluir Usuário</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
