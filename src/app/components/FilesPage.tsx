import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  File, 
  Search, 
  Trash2, 
  Download, 
  BarChart3, 
  Link as LinkIcon,
  Plus,
  FileText,
  FileImage,
  FileVideo,
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import api from '../../lib/axios';
import { toast } from 'sonner';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadCount: number;
  url: string;
  createdAt: string;
}

export function FilesPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/files');
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files', error);
      toast.error('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Arquivo enviado com sucesso!');
      fetchFiles();
    } catch (error) {
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="w-5 h-5 text-emerald-500" />;
    if (type.includes('video')) return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-[#64748b]" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Arquivos e Materiais</h1>
          <p className="text-[#64748b]">Centralize e gerencie todos os recursos complementares das suas aulas.</p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button 
            asChild
            className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2 h-11 px-6 shadow-lg shadow-[#1e40af]/20"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Plus className="w-5 h-5" />
              {uploading ? 'Enviando...' : 'Fazer Upload'}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#e2e8f0] shadow-md rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1e40af]">
              <File className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748b]">Total de Arquivos</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">{files.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e2e8f0] shadow-md rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748b]">Total de Downloads</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">
                {files.reduce((acc, file) => acc + (file.downloadCount || 0), 0)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-md rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748b]">Espaço Utilizado</p>
              <h3 className="text-2xl font-bold text-[#1e293b]">Calculando...</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0] bg-[#f8fafc] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
            <File className="w-5 h-5 text-[#1e40af]" />
            Repositório Geral
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] transition-all"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-[#e2e8f0]">
              <TableHead className="font-semibold text-[#1e293b] py-5 pl-6">Nome do Arquivo</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">Tipo</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">Tamanho</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5">Downloads</TableHead>
              <TableHead className="font-semibold text-[#1e293b] py-5 text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6 py-4"><Skeleton className="h-6 w-64" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell className="pr-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-[#64748b]">
                  Nenhum arquivo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredFiles.map((file) => (
                <TableRow key={file.id} className="group hover:bg-[#f1f5f9]/50 transition-colors border-b border-[#e2e8f0]">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1e293b]">{file.name}</span>
                        <span className="text-[10px] text-[#94a3b8]">{new Date(file.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-[#64748b] bg-[#f1f5f9] border-transparent">
                      {file.type.split('/')[1] || file.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-[#64748b] font-medium">
                    {file.size}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748b] font-bold">
                      <Download className="w-3.5 h-3.5" />
                      {file.downloadCount || 0}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-9 gap-2 text-[#1e40af] hover:bg-blue-50 px-3 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                        Acessar
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
