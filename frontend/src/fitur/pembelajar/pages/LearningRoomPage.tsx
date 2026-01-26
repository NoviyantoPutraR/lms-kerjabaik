import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Menu,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/komponen/ui/sheet';
import { Skeleton } from '@/komponen/ui/skeleton';
import { Separator } from '@/komponen/ui/separator';
import { useCourseDetail } from '@/fitur/pembelajar/api/catalogApi';
import {
    useEnrollments,
    useCourseProgress,
    useUpdateProgress
} from '@/fitur/pembelajar/api/learnerApi';
import { VideoPlayer } from '../komponen/VideoPlayer';
import { TextContent } from '../komponen/TextContent';
import { LearningSidebar } from '../komponen/LearningSidebar';

import { toast } from 'sonner';
import { cn } from '@/pustaka/utils';

export function LearningRoomPage() {
    const { enrollmentId } = useParams<{ enrollmentId: string }>();
    const navigate = useNavigate();
    const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);

    // Fetch data
    const { data: enrollments } = useEnrollments();
    const enrollment = enrollments?.find(e => e.id === enrollmentId);
    const courseId = enrollment?.id_kursus;

    const { data: course, isLoading: courseLoading } = useCourseDetail(courseId || '');
    const { data: progress, isLoading: progressLoading } = useCourseProgress(enrollmentId || '');
    const updateProgressMutation = useUpdateProgress();

    // Find current material
    const allMaterials = course?.modul?.flatMap(m => m.materi || []) || [];
    const currentMaterial = allMaterials.find(m => m.id === currentMaterialId);

    // Initialize current material
    useEffect(() => {
        if (allMaterials.length > 0 && !currentMaterialId) {
            // Logic untuk resume last studied material bisa ditambahkan di sini
            // Untuk sekarang default ke materi pertama yang belum selesai atau materi pertama
            const firstUnfinished = allMaterials.find(m => {
                const prog = progress?.find(p => p.id_materi === m.id);
                return !prog || prog.status !== 'selesai';
            });
            setCurrentMaterialId(firstUnfinished?.id || allMaterials[0].id);
        }
    }, [allMaterials, currentMaterialId, progress]);

    const handleSelectMaterial = (materialId: string) => {
        setCurrentMaterialId(materialId);
    };

    const handleProgressUpdate = (_percent: number, _time: number) => {
        // Only update every 5% or 30 seconds to avoid spamming
        // For simplicity we'll implement throttling later if needed
    };

    const handleComplete = async () => {
        if (!enrollmentId || !currentMaterialId) return;

        try {
            await updateProgressMutation.mutateAsync({
                enrollmentId,
                materiId: currentMaterialId,
                progressPersen: 100,
                waktubelajarDetik: 0, // TODO: track actual time
                status: 'selesai'
            });
            toast.success('Materi diselesaikan!');
        } catch (error) {
            toast.error('Gagal menyimpan progress');
        }
    };

    const handleNext = () => {
        const currentIndex = allMaterials.findIndex(m => m.id === currentMaterialId);
        if (currentIndex < allMaterials.length - 1) {
            setCurrentMaterialId(allMaterials[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = allMaterials.findIndex(m => m.id === currentMaterialId);
        if (currentIndex > 0) {
            setCurrentMaterialId(allMaterials[currentIndex - 1].id);
        }
    };

    if (courseLoading || progressLoading || !enrollment) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:block w-80 h-full border-r">
                <LearningSidebar
                    course={course}
                    progress={progress || []}
                    currentMaterialId={currentMaterialId || undefined}
                    onSelectMaterial={handleSelectMaterial}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-[72px] border-b flex items-center justify-between px-4 bg-background z-10">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <LearningSidebar
                                    course={course}
                                    progress={progress || []}
                                    currentMaterialId={currentMaterialId || undefined}
                                    onSelectMaterial={(id) => {
                                        handleSelectMaterial(id);
                                        // Close sheet logic would go here if controlled
                                    }}
                                />
                            </SheetContent>
                        </Sheet>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/pembelajar/dashboard')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Dasbor</span>
                        </Button>

                        <Separator orientation="vertical" className="h-6" />

                        <h1 className="font-semibold text-lg truncate max-w-[200px] sm:max-w-md">
                            {currentMaterial?.judul}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={allMaterials.findIndex(m => m.id === currentMaterialId) === 0}
                        >
                            <ChevronLeft className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Sebelumnya</span>
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            size="sm"
                            onClick={() => {
                                handleComplete();
                                handleNext();
                            }}
                            disabled={allMaterials.findIndex(m => m.id === currentMaterialId) === allMaterials.length - 1}
                        >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <ChevronRight className="h-4 w-4 sm:ml-2" />
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {currentMaterial ? (
                            <>
                                {currentMaterial.tipe === 'video' && currentMaterial.url_berkas ? (
                                    <VideoPlayer
                                        url={currentMaterial.url_berkas}
                                        onComplete={handleComplete}
                                        onProgress={handleProgressUpdate}
                                        autoPlay
                                    />
                                ) : currentMaterial.tipe === 'teks' && currentMaterial.konten ? (
                                    <div className="bg-card rounded-lg p-8 shadow-sm border">
                                        <TextContent content={currentMaterial.konten} />
                                        <Button
                                            className="mt-8 w-full sm:w-auto"
                                            onClick={handleComplete}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Tandai Selesai
                                        </Button>
                                    </div>
                                ) : currentMaterial.tipe === 'dokumen' && currentMaterial.url_berkas ? (
                                    <div className="bg-card rounded-lg p-4 shadow-sm border space-y-4">
                                        <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
                                            <iframe
                                                src={currentMaterial.url_berkas}
                                                className="w-full h-full"
                                                title={currentMaterial.judul}
                                            />
                                        </div>
                                        <Button
                                            className="w-full sm:w-auto"
                                            onClick={handleComplete}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Tandai Selesai
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                                        <p className="text-muted-foreground">Konten tidak didukung atau kosong</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-6 border-t">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{currentMaterial.judul}</h2>
                                        {currentMaterial.durasi_menit && (
                                            <p className="text-muted-foreground flex items-center gap-2">
                                                <CheckCircle className={cn(
                                                    "h-4 w-4",
                                                    progress?.find(p => p.id_materi === currentMaterial.id)?.status === 'selesai'
                                                        ? "text-green-500"
                                                        : "text-muted-foreground"
                                                )} />
                                                {currentMaterial.durasi_menit} menit
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Pilih materi untuk mulai belajar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
