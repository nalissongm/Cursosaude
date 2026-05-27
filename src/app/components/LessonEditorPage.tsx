import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Video, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Clock,
  ExternalLink,
  Play
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import api from '../../lib/axios';
import { toast } from 'sonner';
import axios from 'axios';

interface LessonData {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'document';
  videoUrl?: string;
  durationSeconds?: number;
  status?: 'processing' | 'ready' | 'error';
}

export function LessonEditorPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSubmitting] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/lessons/${lessonId}`);
      setLesson(data);
    } catch (error) {
      toast.error('Erro ao carregar detalhes da aula');
      navigate('/dashboard/gestao-cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;

    try {
      setSubmitting(true);
      await api.patch(`/lessons/${lessonId}`, {
        title: lesson.title,
        description: lesson.description,
        contentType: lesson.contentType
      });
      toast.success('Aula atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Step 1: Get Mux Upload URL
      const { data } = await api.post(`/lessons/${lessonId}/mux-upload-url`);
      const { uploadUrl } = data;

      // Step 2: Direct Upload to Mux
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });

      toast.success('Upload concluído! Processando vídeo...');
      setProcessingStatus('processing');
      startPollingStatus();
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Erro ao realizar upload do vídeo');
      setUploading(false);
    }
  };

  const startPollingStatus = () => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/lessons/${lessonId}`);
        if (data.status === 'ready') {
          setLesson(data);
          setUploading(false);
          setProcessingStatus(null);
          toast.success('Vídeo pronto para exibição!');
          clearInterval(interval);
        } else if (data.status === 'error') {
          setUploading(false);
          setProcessingStatus('error');
          toast.error('Erro ao processar vídeo');
          clearInterval(interval);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 5000);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2 text-[#64748b] hover:text-[#1e40af] -ml-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-7 bg-white text-[#1e40af] border-[#1e40af] font-bold">
            Editando Aula
          </Badge>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2 h-10 px-6 rounded-xl shadow-lg shadow-[#1e40af]/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Content Type & Video Uploader */}
        <Card className="border-[#e2e8f0] shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <CardTitle className="text-xl flex items-center gap-2">
              <Video className="w-5 h-5 text-[#1e40af]" />
              Conteúdo da Aula
            </CardTitle>
            <CardDescription>Configure o vídeo ou documento desta lição.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2 space-y-4">
                  <label className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Tipo de Conteúdo</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLesson(prev => prev ? { ...prev, contentType: 'video' } : null)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${lesson?.contentType === 'video' ? 'border-[#1e40af] bg-blue-50 text-[#1e40af]' : 'border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]'}`}
                    >
                      <Video className="w-8 h-8" />
                      <span className="font-bold">Vídeo</span>
                    </button>
                    <button 
                      onClick={() => setLesson(prev => prev ? { ...prev, contentType: 'document' } : null)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${lesson?.contentType === 'document' ? 'border-[#1e40af] bg-blue-50 text-[#1e40af]' : 'border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]'}`}
                    >
                      <FileText className="w-8 h-8" />
                      <span className="font-bold">Documento</span>
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                  <label className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Mídia do Vídeo</label>
                  
                  {lesson?.videoUrl && !uploading ? (
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Badge className="bg-emerald-500 text-white gap-1.5 h-8 px-4 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Vídeo Ativo
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/50" />
                      </div>
                    </div>
                  ) : uploading ? (
                    <div className="aspect-video bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <Loader2 className="w-10 h-10 text-[#1e40af] animate-spin" />
                      <div>
                        <p className="font-bold text-[#1e293b]">{processingStatus === 'processing' ? 'Processando no Mux...' : 'Enviando arquivo...'}</p>
                        <p className="text-xs text-[#64748b] mt-1">Isso pode levar alguns minutos dependendo do tamanho.</p>
                      </div>
                      <div className="w-full max-w-xs">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-[10px] text-[#94a3b8] mt-2 font-bold uppercase">{uploadProgress}% CONCLUÍDO</p>
                      </div>
                    </div>
                  ) : (
                    <label className="aspect-video bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-blue-50 hover:border-[#1e40af] transition-all group">
                      <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#1e40af]" />
                      </div>
                      <p className="font-bold text-[#1e293b]">Clique para enviar vídeo</p>
                      <p className="text-xs text-[#64748b] mt-1">MP4, MOV ou AVI (Máx 2GB)</p>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-[#e2e8f0] shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1e40af]" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Título da Aula</label>
              <input 
                type="text" 
                value={lesson?.title || ''}
                onChange={(e) => setLesson(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="Ex: Primeiros Socorros em Ambiente Hospitalar"
                className="w-full p-4 bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e293b] uppercase tracking-wider">Descrição / Conteúdo</label>
              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-[#e2e8f0] p-2 flex gap-1">
                  <div className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-xs font-bold text-[#64748b] cursor-pointer">B</div>
                  <div className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-xs italic text-[#64748b] cursor-pointer">I</div>
                  <div className="w-8 h-8 rounded hover:bg-white flex items-center justify-center text-xs underline text-[#64748b] cursor-pointer">U</div>
                </div>
                <textarea 
                  value={lesson?.description || ''}
                  onChange={(e) => setLesson(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Escreva aqui o conteúdo textual ou descrição da aula..."
                  className="w-full p-4 bg-white focus:outline-none transition-all resize-none min-h-[300px] leading-relaxed"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
