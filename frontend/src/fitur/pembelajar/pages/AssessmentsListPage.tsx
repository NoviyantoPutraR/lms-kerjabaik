import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Trophy,
    AlertCircle,
    Play,
    CheckCircle2,
    Search
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/komponen/ui/card';
import { Input } from '@/komponen/ui/input';
import { Button } from '@/komponen/ui/button';
import { Badge } from '@/komponen/ui/badge';
import { Skeleton } from '@/komponen/ui/skeleton';
import {
    useEnrollments,
    useAssessments,
    useAssessmentAttempts,
    useAssignments
} from '@/fitur/pembelajar/api/learnerApi';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/komponen/ui/tabs';
import type { Assessment } from '../tipe';

export function AssessmentsListPage() {
    const navigate = useNavigate();
    const { data: enrollments } = useEnrollments();
    const { data: assessments, isLoading: isLoadingAssessments } = useAssessments();
    const { data: assignmentsList, isLoading: isLoadingAssignments } = useAssignments();

    const [searchTerm, setSearchTerm] = useState('');

    // Get unique course IDs from enrollments for filtering
    const enrolledCourseIds = enrollments?.map(e => e.id_kursus) || [];

    // Filter Kuis & Ujian (Exams)
    // Only show exams from enrolled courses
    const quizzesAndExams = assessments?.filter(a =>
        enrolledCourseIds.includes(a.id_kursus) &&
        (a.tipe === 'kuis' || a.tipe === 'ujian')
    ).filter(a =>
        a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.deskripsi && a.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter Tugas Proyek (Tasks/Assignments)
    // Only show assignments from enrolled courses
    const filteredAssignments = assignmentsList?.filter(a =>
        (a.asesmen?.kursus?.id && enrolledCourseIds.includes(a.asesmen.kursus.id))
    ).filter(a =>
        a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.asesmen?.kursus?.judul && a.asesmen.kursus.judul.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pendingAssignments = filteredAssignments?.filter(
        a => !a.pengumpulan_tugas || a.pengumpulan_tugas.status === 'perlu_revisi'
    );

    const submittedAssignments = filteredAssignments?.filter(
        a => a.pengumpulan_tugas?.status === 'dikumpulkan'
    );

    const gradedAssignments = filteredAssignments?.filter(
        a => a.pengumpulan_tugas?.status === 'dinilai' || a.pengumpulan_tugas?.status === 'ditolak'
    );

    const getDeadlineStatus = (deadline?: string) => {
        if (!deadline) return null;
        const date = new Date(deadline);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return <Badge variant="destructive" className="rounded-sm shadow-sm">Terlewat</Badge>;
        if (days <= 3) return <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 rounded-sm shadow-sm border">Sisa {days} hari</Badge>;
        return <Badge variant="secondary" className="rounded-sm">Tenggat: {format(date, 'd MMM', { locale: localeId })}</Badge>;
    };

    const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
        const { data: attempts } = useAssessmentAttempts(assessment.id);
        const bestScore = attempts?.reduce((max, attempt) => Math.max(max, attempt.nilai || 0), 0) || 0;
        const totalAttempts = attempts?.length || 0;
        const hasActiveAttempt = attempts?.some(a => a.status === 'sedang_berjalan');
        const canTakeAssessment = assessment.jumlah_percobaan === -1 || totalAttempts < assessment.jumlah_percobaan;

        const getStatusBadge = () => {
            if (hasActiveAttempt) {
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-sm rounded-sm hover:bg-amber-100 font-medium">Sedang Berlangsung</Badge>;
            }
            if (totalAttempts === 0) {
                return <Badge variant="secondary" className="font-normal rounded-sm">Belum Dikerjakan</Badge>;
            }
            if (bestScore >= assessment.nilai_kelulusan) {
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm rounded-sm hover:bg-emerald-100">Lulus</Badge>;
            }
            return <Badge variant="destructive" className="rounded-sm shadow-sm">Belum Lulus</Badge>;
        };

        return (
            <Card className="hover:shadow-md transition-all duration-200 rounded-sm shadow-sm border-border">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="capitalize rounded-sm">
                            {assessment.tipe}
                        </Badge>
                        {getStatusBadge()}
                    </div>
                    <CardTitle className="mt-4 text-xl">{assessment.judul}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                        {assessment.deskripsi}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {assessment.durasi_menit && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{assessment.durasi_menit} menit</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Trophy className="h-4 w-4" />
                            <span>Passing: {assessment.nilai_kelulusan}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                {assessment.jumlah_percobaan === -1
                                    ? 'Unlimited'
                                    : `${totalAttempts}/${assessment.jumlah_percobaan} percobaan`
                                }
                            </span>
                        </div>
                        {totalAttempts > 0 && (
                            <div className="flex items-center gap-2 text-emerald-600 border-t pt-2 col-span-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="font-medium">
                                    Nilai terbaik: {bestScore}%
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        {hasActiveAttempt ? (
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    const activeAttempt = attempts?.find(a => a.status === 'sedang_berjalan');
                                    navigate(`/pembelajar/penilaian/${assessment.id}/take/${activeAttempt?.id}`);
                                }}
                            >
                                Lanjutkan
                            </Button>
                        ) : canTakeAssessment ? (
                            <Button
                                className="flex-1"
                                onClick={() => navigate(`/pembelajar/penilaian/${assessment.id}`)}
                            >
                                <Play className="h-4 w-4 mr-2" />
                                {totalAttempts === 0 ? 'Mulai Sekarang' : 'Coba Lagi'}
                            </Button>
                        ) : (
                            <Button className="flex-1" disabled>
                                Percobaan Habis
                            </Button>
                        )}

                        {totalAttempts > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/pembelajar/penilaian/${assessment.id}/results`)}
                            >
                                Hasil
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isLoadingAssessments || isLoadingAssignments) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pusat Asesmen</h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola tugas proyek dan kuis ujian Anda dalam satu tempat yang terorganisir.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari asesmen atau tugas..."
                        className="pl-8 rounded-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="exams" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="exams">Kuis & Ujian</TabsTrigger>
                    <TabsTrigger value="tasks">Tugas Proyek</TabsTrigger>
                </TabsList>

                <TabsContent value="exams" className="space-y-6">
                    <div className="bg-primary/5 p-4 rounded-sm flex items-start gap-3 border border-primary/10 mb-6">
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-sm">Ruang Ujian</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Kerjakan kuis dan ujian untuk menguji pemahaman teori Anda. Hasil akan langsung keluar setelah dikumpulkan.
                            </p>
                        </div>
                    </div>
                    {quizzesAndExams && quizzesAndExams.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {quizzesAndExams.map((assessment) => (
                                <AssessmentCard key={assessment.id} assessment={assessment} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Belum ada kuis atau ujian yang tersedia untuk Anda." />
                    )}
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-sm flex items-start gap-3 border border-amber-200 dark:border-amber-800 mb-6">
                        <Trophy className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-sm">Pusat Tugas</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Kirimkan tugas praktik atau proyek akhir Anda untuk mendapatkan penilaian dan feedback dari instruktur.
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-4">
                            <TabsTrigger value="pending">
                                Perlu Dikerjakan
                                {pendingAssignments && pendingAssignments.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                        {pendingAssignments.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="submitted">Dikumpulkan</TabsTrigger>
                            <TabsTrigger value="graded">Dinilai</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pendingAssignments && pendingAssignments.length > 0 ? (
                                    pendingAssignments.map((assignment) => (
                                        <Card key={assignment.id} className="flex flex-col rounded-sm shadow-sm hover:shadow-md transition-all duration-200 border-border">
                                            <CardHeader>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Badge variant="outline" className="rounded-sm bg-background">{assignment.asesmen?.kursus?.judul}</Badge>
                                                    {getDeadlineStatus(assignment.deadline)}
                                                </div>
                                                <CardTitle className="line-clamp-2 mt-2 text-xl">{assignment.judul}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {assignment.deskripsi}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-auto pt-0">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => navigate(`/pembelajar/assignments/${assignment.id}`)}
                                                >
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Kerjakan Tugas
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState message="Tidak ada tugas yang perlu dikerjakan saat ini" />
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="submitted" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {submittedAssignments && submittedAssignments.length > 0 ? (
                                    submittedAssignments.map((assignment) => (
                                        <Card key={assignment.id} className="rounded-sm shadow-sm hover:shadow-md transition-all duration-200 border-border">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="rounded-sm bg-background">{assignment.asesmen?.kursus?.judul}</Badge>
                                                    <Badge className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 rounded-sm shadow-sm border">
                                                        Dikumpulkan
                                                    </Badge>
                                                </div>
                                                <CardTitle className="line-clamp-2 mt-2 text-xl">{assignment.judul}</CardTitle>
                                                <CardDescription>
                                                    Dikumpulkan pada: {assignment.pengumpulan_tugas?.created_at ? format(new Date(assignment.pengumpulan_tugas.created_at), 'd MMM HH:mm', { locale: localeId }) : '-'}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => navigate(`/pembelajar/assignments/${assignment.id}`)}
                                                >
                                                    Lihat Detail
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState message="Belum ada tugas yang dikumpulkan" />
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="graded" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {gradedAssignments && gradedAssignments.length > 0 ? (
                                    gradedAssignments.map((assignment) => (
                                        <Card key={assignment.id} className="rounded-sm shadow-sm hover:shadow-md transition-all duration-200 border-border">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="rounded-sm bg-background">{assignment.asesmen?.kursus?.judul}</Badge>
                                                    {assignment.pengumpulan_tugas?.status === 'ditolak' ? (
                                                        <Badge variant="destructive" className="rounded-sm shadow-sm">
                                                            Ditolak
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 rounded-sm shadow-sm border">
                                                            Nilai: {assignment.pengumpulan_tugas?.nilai}/100
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="line-clamp-2 mt-2 text-xl">{assignment.judul}</CardTitle>
                                                <CardDescription>
                                                    Feedback: {assignment.pengumpulan_tugas?.feedback || "Tidak ada feedback"}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => navigate(`/pembelajar/assignments/${assignment.id}`)}
                                                >
                                                    Lihat Hasil
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState message="Belum ada tugas yang dinilai" />
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <Card className="border-dashed border-2 rounded-sm shadow-none bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">
                    {message}<br />
                    <span className="text-xs">Daftar kursus terlebih dahulu untuk mengakses asesmen.</span>
                </p>
            </CardContent>
        </Card>
    );
}
