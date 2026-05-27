import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  BookOpen, 
  User, 
  Calendar, 
  CheckCircle2,
  Trash2,
  Filter,
  Users
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import api from '../../lib/axios';
import { toast } from 'sonner';

interface EnrollmentData {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  user: { fullName: string, email: string };
  course: { title: string };
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface CourseData {
  id: string;
  title: string;
}

export function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollRes, usersRes, coursesRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/users'),
        api.get('/courses')
      ]);
      setEnrollments(enrollRes.data);
      setUsers(usersRes.data.filter((u: UserData) => u.role === 'STUDENT'));
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Failed to fetch enrollment data', error);
      toast.error('Erro ao carregar dados de matrícula');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedCourse) {
      toast.error('Selecione um aluno e um curso');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/enrollments', {
        userId: selectedUser,
        courseId: selectedCourse
      });
      toast.success('Aluno matriculado com sucesso!');
      setSelectedUser('');
      setSelectedCourse('');
      fetchData();
    } catch (error) {
      toast.error('Erro ao realizar matrícula');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEnrollment = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta matrícula?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      toast.success('Matrícula removida com sucesso');
      fetchData();
    } catch (error) {
      toast.error('Erro ao remover matrícula');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Gestão de Matrículas</h1>
        <p className="text-[#64748b]">Associe alunos aos cursos disponíveis na plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrollment Form */}
        <Card className="lg:col-span-1 border-[#e2e8f0] shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden h-fit sticky top-24">
          <CardHeader className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#1e40af]" />
              Nova Matrícula
            </CardTitle>
            <CardDescription>Selecione o aluno e o curso para matricular.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleEnroll} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1e293b] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#64748b]" />
                  Aluno
                </label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="rounded-xl h-11 border-[#e2e8f0] focus:ring-[#1e40af]">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#e2e8f0] shadow-xl max-h-64">
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id} className="rounded-lg">
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-xs text-[#64748b]">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1e293b] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#64748b]" />
                  Curso
                </label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="rounded-xl h-11 border-[#e2e8f0] focus:ring-[#1e40af]">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#e2e8f0] shadow-xl max-h-64">
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id} className="rounded-lg">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white h-12 rounded-xl shadow-lg shadow-[#1e40af]/20 transition-all font-semibold text-base"
              >
                {submitting ? 'Processando...' : 'Confirmar Matrícula'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Enrollment List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
              <h2 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1e40af]" />
                Matrículas Realizadas
              </h2>
              <div className="px-3 py-1 bg-[#dbeafe] text-[#1e40af] rounded-full text-xs font-bold">
                {enrollments.length} Total
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-[#e2e8f0]">
                  <TableHead className="font-semibold text-[#1e293b] py-5 pl-6">Aluno</TableHead>
                  <TableHead className="font-semibold text-[#1e293b] py-5">Curso</TableHead>
                  <TableHead className="font-semibold text-[#1e293b] py-5 text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6 py-4"><Skeleton className="h-6 w-48" /></TableCell>
                      <TableCell className="py-4"><Skeleton className="h-6 w-48" /></TableCell>
                      <TableCell className="pr-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-64 text-center text-[#64748b]">
                      Nenhuma matrícula encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enroll) => (
                    <TableRow key={enroll.id} className="group hover:bg-[#f1f5f9]/50 transition-colors border-b border-[#e2e8f0]">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1e293b]">{enroll.user?.fullName}</span>
                          <span className="text-xs text-[#64748b]">{enroll.user?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-[#1e293b]">
                          <div className="w-8 h-8 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-[#1e40af]">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{enroll.course?.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEnrollment(enroll.id)}
                          className="hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
