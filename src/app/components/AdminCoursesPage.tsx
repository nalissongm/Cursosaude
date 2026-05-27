import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Layers, 
  FileVideo, 
  Settings2, 
  Trash2, 
  Edit, 
  ChevronRight, 
  Play,
  FileText,
  Clock,
  MoreVertical,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from './ui/accordion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import api from '../../lib/axios';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  contentType: 'video' | 'document';
  durationSeconds?: number;
}

interface Module {
  id: string;
  title: string;
  lessons?: Lesson[];
  loadingLessons?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  instructor?: { fullName: string };
  modules?: Module[];
  loadingModules?: boolean;
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/courses');
      setCourses(data.map((c: any) => ({ ...c, modules: [], loadingModules: false })));
    } catch (error) {
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    // Check if already loaded
    const course = courses.find(c => c.id === courseId);
    if (course?.modules && course.modules.length > 0) return;

    try {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, loadingModules: true } : c));
      const { data } = await api.get(`/courses/${courseId}/modules`);
      setCourses(prev => prev.map(c => 
        c.id === courseId 
          ? { ...c, modules: data.map((m: any) => ({ ...m, lessons: [], loadingLessons: false })), loadingModules: false } 
          : c
      ));
    } catch (error) {
      toast.error('Erro ao carregar módulos');
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, loadingModules: false } : c));
    }
  };

  const fetchLessons = async (courseId: string, moduleId: string) => {
    const course = courses.find(c => c.id === courseId);
    const module = course?.modules?.find(m => m.id === moduleId);
    if (module?.lessons && module.lessons.length > 0) return;

    try {
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        modules: c.modules?.map(m => m.id === moduleId ? { ...m, loadingLessons: true } : m)
      } : c));
      
      const { data } = await api.get(`/modules/${moduleId}/lessons`);
      
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        modules: c.modules?.map(m => m.id === moduleId ? { ...m, lessons: data, loadingLessons: false } : m)
      } : c));
    } catch (error) {
      toast.error('Erro ao carregar aulas');
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        modules: c.modules?.map(m => m.id === moduleId ? { ...m, loadingLessons: false } : m)
      } : c));
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Gestão de Conteúdo</h1>
          <p className="text-[#64748b]">Configure seus cursos, módulos e aulas de forma hierárquica.</p>
        </div>
        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white gap-2 h-11 px-6 shadow-lg shadow-[#1e40af]/20">
          <Plus className="w-5 h-5" />
          Criar Novo Curso
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="border-[#e2e8f0] shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
              <Accordion type="single" collapsible onValueChange={(val) => val && fetchModules(course.id)}>
                <AccordionItem value={course.id} className="border-none">
                  <div className="flex items-center group">
                    <AccordionTrigger className="flex-1 px-6 py-6 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-[#f1f5f9] rounded-xl flex items-center justify-center text-[#1e40af] group-hover:bg-[#1e40af] group-hover:text-white transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#1e293b]">{course.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-[#64748b]">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {course.modules?.length || 0} módulos
                            </span>
                            <span className="w-1 h-1 bg-[#cbd5e1] rounded-full" />
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {course.instructor?.fullName || 'Sem instrutor'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <div className="px-6 flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#1e40af] hover:bg-white hover:shadow-sm">
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-[#64748b] hover:text-[#1e40af] hover:bg-white hover:shadow-sm">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-[#e2e8f0] shadow-xl">
                          <DropdownMenuItem className="rounded-lg gap-2 py-2.5">
                            <Edit className="w-4 h-4" /> Editar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-2 py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Excluir Curso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <AccordionContent className="px-6 pb-6 pt-2 border-t border-[#f1f5f9]">
                    {course.loadingModules ? (
                      <div className="space-y-3 pt-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-[#1e40af] uppercase tracking-wider">Estrutura de Módulos</h4>
                          <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-lg border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white transition-all text-xs font-bold">
                            <Plus className="w-3.5 h-3.5" /> Adicionar Módulo
                          </Button>
                        </div>

                        {course.modules?.length === 0 ? (
                          <div className="py-8 text-center bg-[#f8fafc] rounded-xl border-2 border-dashed border-[#e2e8f0]">
                            <p className="text-[#64748b] text-sm italic">Nenhum módulo cadastrado ainda.</p>
                          </div>
                        ) : (
                          <Accordion type="single" collapsible onValueChange={(val) => val && fetchLessons(course.id, val)}>
                            <div className="space-y-3">
                              {course.modules?.map((module, mIdx) => (
                                <AccordionItem key={module.id} value={module.id} className="border-[#e2e8f0] border rounded-xl bg-white overflow-hidden shadow-sm">
                                  <div className="flex items-center group/mod">
                                    <AccordionTrigger className="flex-1 px-5 py-4 hover:no-underline">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#eff6ff] rounded-lg flex items-center justify-center text-[#1e40af] font-bold text-sm">
                                          {mIdx + 1}
                                        </div>
                                        <span className="font-semibold text-[#1e293b]">{module.title}</span>
                                      </div>
                                    </AccordionTrigger>
                                    <div className="px-5 flex items-center gap-1">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94a3b8] hover:text-[#1e40af]">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94a3b8] hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <AccordionContent className="px-5 pb-5 pt-1">
                                    <div className="pl-11 space-y-3">
                                      <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9]">
                                        <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Aulas</span>
                                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-[#1e40af] hover:bg-blue-50 text-[11px] font-bold px-2 rounded-md">
                                          <Plus className="w-3 h-3" /> Nova Aula
                                        </Button>
                                      </div>

                                      {module.loadingLessons ? (
                                        <div className="space-y-2">
                                          <Skeleton className="h-10 w-full rounded-lg" />
                                          <Skeleton className="h-10 w-full rounded-lg" />
                                        </div>
                                      ) : module.lessons?.length === 0 ? (
                                        <p className="text-[#94a3b8] text-xs py-2 italic">Nenhuma aula cadastrada.</p>
                                      ) : (
                                        <div className="space-y-2">
                                          {module.lessons?.map((lesson, lIdx) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] hover:bg-white group/lesson transition-all">
                                              <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${lesson.contentType === 'video' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                  {lesson.contentType === 'video' ? <Play className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className="text-sm font-medium text-[#475569]">{lIdx + 1}. {lesson.title}</span>
                                              </div>
                                              <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-7 w-7 text-[#94a3b8] hover:text-[#1e40af]"
                                                  onClick={() => navigate(`/dashboard/editor-aula/${lesson.id}`)}
                                                >
                                                  <Edit className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-[#94a3b8] hover:text-red-500">
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </div>
                          </Accordion>
                        )}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
