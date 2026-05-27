import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  User, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Reply, 
  MoreVertical,
  Filter,
  Check,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import api from '../../lib/axios';
import { toast } from 'sonner';

interface Doubt {
  id: string;
  content: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  user: { fullName: string, avatar?: string };
  lesson: { title: string, module: { title: string } };
  replies: any[];
}

export function DoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('PENDING');

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/doubts');
      setDoubts(data);
    } catch (error) {
      console.error('Failed to fetch doubts', error);
      toast.error('Erro ao carregar dúvidas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const filteredDoubts = doubts.filter(doubt => {
    if (filter === 'ALL') return true;
    return doubt.status === filter;
  });

  const handleResolve = async (id: string) => {
    try {
      await api.patch(`/doubts/${id}`, { status: 'RESOLVED' });
      toast.success('Dúvida marcada como resolvida');
      fetchDoubts();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Central de Dúvidas</h1>
          <p className="text-[#64748b]">Acompanhe e responda as perguntas enviadas pelos alunos.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#e2e8f0] shadow-sm">
          <Button 
            variant={filter === 'PENDING' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('PENDING')}
            className={`rounded-lg h-9 px-4 ${filter === 'PENDING' ? 'bg-[#1e40af] text-white shadow-md shadow-blue-200' : 'text-[#64748b]'}`}
          >
            Pendentes
          </Button>
          <Button 
            variant={filter === 'RESOLVED' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('RESOLVED')}
            className={`rounded-lg h-9 px-4 ${filter === 'RESOLVED' ? 'bg-[#1e40af] text-white shadow-md shadow-blue-200' : 'text-[#64748b]'}`}
          >
            Resolvidas
          </Button>
          <Button 
            variant={filter === 'ALL' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setFilter('ALL')}
            className={`rounded-lg h-9 px-4 ${filter === 'ALL' ? 'bg-[#1e40af] text-white shadow-md shadow-blue-200' : 'text-[#64748b]'}`}
          >
            Todas
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-[#e2e8f0] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))
        ) : filteredDoubts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
            <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-[#cbd5e1]" />
            </div>
            <h3 className="text-lg font-bold text-[#1e293b]">Tudo em dia!</h3>
            <p className="text-[#64748b]">Não há dúvidas {filter === 'PENDING' ? 'pendentes' : 'nesta categoria'}.</p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="border-[#e2e8f0] shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden bg-white">
              <CardHeader className="p-6 pb-0 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-[#f1f5f9]">
                    <AvatarImage src={doubt.user?.avatar} />
                    <AvatarFallback className="bg-[#1e40af] text-white text-xs font-bold">
                      {doubt.user?.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-bold text-[#1e293b]">{doubt.user?.fullName}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-[#64748b] mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(doubt.createdAt).toLocaleString('pt-BR')}
                      <span className="w-1 h-1 bg-[#cbd5e1] rounded-full" />
                      <div className="flex items-center gap-1 text-[#1e40af] font-semibold">
                        <BookOpen className="w-3 h-3" />
                        {doubt.lesson?.title}
                      </div>
                    </div>
                  </div>
                </div>
                {doubt.status === 'PENDING' ? (
                  <Badge className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-50">Pendente</Badge>
                ) : (
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">Resolvida</Badge>
                )}
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#f1f5f9] mb-6">
                  <p className="text-[#475569] leading-relaxed italic">"{doubt.content}"</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-xl border-[#e2e8f0] hover:bg-blue-50 hover:text-[#1e40af] hover:border-[#1e40af] transition-all gap-2 h-10">
                      <Reply className="w-4 h-4" />
                      Responder
                    </Button>
                    {doubt.status === 'PENDING' && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleResolve(doubt.id)}
                        className="rounded-xl text-emerald-600 hover:bg-emerald-50 gap-2 h-10"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Marcar Resolvida
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#94a3b8] hover:bg-[#f8fafc] rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                {/* Response area (hidden by default, would toggle) */}
                <div className="mt-6 pt-6 border-t border-[#f1f5f9] hidden">
                  <div className="relative">
                    <textarea 
                      placeholder="Escreva sua resposta aqui..."
                      className="w-full p-4 pr-12 bg-white border border-[#e2e8f0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] transition-all resize-none min-h-[100px]"
                    />
                    <Button className="absolute bottom-3 right-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white p-2 h-10 w-10 rounded-xl">
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
