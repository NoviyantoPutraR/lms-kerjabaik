import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User, CheckCircle, PlayCircle, FileText, ChevronRight, Share2, Video } from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Badge } from '@/komponen/ui/badge';
import { Skeleton } from '@/komponen/ui/skeleton';
import { Separator } from '@/komponen/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/komponen/ui/accordion";
import { useCourseDetail, useIsEnrolled } from '@/fitur/pembelajar/api/catalogApi';
import { useEnrollCourse } from '@/fitur/pembelajar/api/learnerApi';
import { toast } from 'sonner';
import { StudentZoomSessions } from '@/fitur/pembelajar/komponen/StudentZoomSessions';
import { TombolUnduhSertifikat } from '@/fitur/pembelajar/komponen/TombolUnduhSertifikat';

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading: courseLoading } = useCourseDetail(id!);
  const { data: enrollmentStatus, isLoading: enrollmentLoading } = useIsEnrolled(id!);
  const enrollMutation = useEnrollCourse();

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(id!);
      toast.success('Berhasil mendaftar kursus!');
    } catch (error) {
      toast.error('Gagal mendaftar kursus. Silakan coba lagi.');
    }
  };

  const handleContinueLearning = () => {
    if (enrollmentStatus && 'enrollmentId' in enrollmentStatus) {
      navigate(`/pembelajar/learn/${enrollmentStatus.enrollmentId}`);
    }
  };

  const getTingkatColor = (tingkat?: string) => {
    switch (tingkat) {
      case 'pemula':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'menengah':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'lanjutan':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const totalMateri = course?.modul?.reduce((sum, modul) => sum + (modul.materi?.length || 0), 0) || 0;
  const totalDurasi = course?.modul?.reduce((sum, modul) => sum + (modul.durasi_menit || 0), 0) || 0;

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Kursus tidak ditemukan</h2>
        <p className="text-gray-500 mb-6">Kursus yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Button onClick={() => navigate('/pembelajar/courses')} variant="outline">
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-20">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Compact Breadcrumb */}
        <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pembelajar/courses')}
            className="mb-6 hover:bg-white/50 dark:hover:bg-zinc-800/50 -ml-2 text-muted-foreground hover:text-foreground h-8 text-xs font-medium"
        >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Kembali ke Katalog
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-8 space-y-8">
                {/* Compact Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        {course.kategori && (
                            <Badge variant="secondary" className="bg-white hover:bg-white border-zinc-200 text-zinc-600 shadow-sm font-semibold rounded-md px-2 py-0.5">
                                {course.kategori}
                            </Badge>
                        )}
                        {course.tingkat && (
                            <Badge variant="outline" className={`${getTingkatColor(course.tingkat)} bg-opacity-100 border px-2 py-0.5 rounded-md`}>
                                {course.tingkat.charAt(0).toUpperCase() + course.tingkat.slice(1)}
                            </Badge>
                        )}
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                        {course.judul}
                    </h1>

                    {/* Compact Meta Stats */}
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                         <div className="flex items-center gap-1.5">
                             <User className="h-3.5 w-3.5" />
                             <span className="text-zinc-700 dark:text-zinc-300">{course.instruktur?.nama_lengkap}</span>
                         </div>
                         <div className="w-1 h-1 rounded-full bg-zinc-300" />
                         <div className="flex items-center gap-1.5">
                             <Clock className="h-3.5 w-3.5" />
                             <span>{Math.floor(totalDurasi / 60)}j {totalDurasi % 60}m</span>
                         </div>
                         <div className="w-1 h-1 rounded-full bg-zinc-300" />
                         <div className="flex items-center gap-1.5">
                             <BookOpen className="h-3.5 w-3.5" />
                             <span>{course.modul?.length || 0} Modul</span>
                         </div>
                    </div>

                    {course.deskripsi && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl border-l-2 border-zinc-100 pl-4">
                            {course.deskripsi}
                        </p>
                    )}
                </div>

                <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                {/* About Course Section - Inline */}
                {/* Removed separate 'Tentang Kursus' section as it often duplicates the description header. 
                    If detailed HTML description exists in future, restore as a compact block. 
                */}

                {/* Zoom Sessions Section - Only for Enrolled Students */}
                {enrollmentStatus && 'enrolled' in enrollmentStatus && enrollmentStatus.enrolled && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Video className="h-4 w-4 text-blue-600" />
                                Sesi Live Zoom
                            </h2>
                        </div>
                        <StudentZoomSessions kursusId={id!} />
                        <Separator className="bg-zinc-100 dark:bg-zinc-800 mt-8" />
                    </section>
                )}

                {/* Compact Curriculum Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-violet-600" />
                            Kurikulum Kursus
                        </h2>
                        <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-100 rounded-md">
                            {totalMateri} Materi
                        </span>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        {course.modul && course.modul.length > 0 ? (
                            <Accordion type="multiple" defaultValue={course.modul.map(m => m.id)} className="w-full">
                                {course.modul
                                    .sort((a, b) => a.urutan - b.urutan)
                                    .map((modul, index) => (
                                    <AccordionItem key={modul.id} value={modul.id} className="border-b last:border-0 border-zinc-100 dark:border-zinc-800">
                                        <AccordionTrigger className="px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:no-underline transition-colors group">
                                            <div className="flex text-left gap-3 items-center w-full">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:bg-white group-hover:text-violet-600 transition-colors border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-700">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                                                        {modul.judul}
                                                    </h3>
                                                </div>
                                                <div className="text-[10px] text-zinc-400 font-medium mr-2 whitespace-nowrap">
                                                    {modul.durasi_menit} m
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-0 pb-0 bg-zinc-50/30 dark:bg-zinc-900/50">
                                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
                                                {modul.materi && modul.materi.length > 0 ? (
                                                    modul.materi
                                                        .sort((a, b) => a.urutan - b.urutan)
                                                        .map((materi) => (
                                                        <div key={materi.id} className="flex items-center gap-3 px-5 py-2.5 pl-14 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                                                            {materi.tipe === 'video' ? (
                                                                <PlayCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                                            ) : materi.tipe === 'dokumen' ? (
                                                                <FileText className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                                                            ) : (
                                                                <BookOpen className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                                            )}
                                                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex-1 truncate">
                                                                {materi.judul}
                                                            </span>
                                                            {materi.durasi_menit && (
                                                                <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                                                                    {materi.durasi_menit} m
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-5 py-3 text-xs text-zinc-400 text-center italic">
                                                        Belum ada materi
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="p-8 text-center bg-zinc-50">
                                <BookOpen className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                                <p className="text-zinc-500 text-sm font-medium">Belum ada kurikulum yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Sidebar (Right Column) - Sticky */}
            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-20 space-y-5">
                    {/* Course Card Preview */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 overflow-hidden">
                        {/* Thumbnail */}
                        <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800 group overflow-hidden">
                             {course.url_gambar_mini ? (
                                <img
                                  src={course.url_gambar_mini}
                                  alt={course.judul}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                                  <BookOpen className="h-12 w-12 text-white/80" />
                                </div>
                              )}
                             {/* Play Overlay */}
                             {enrollmentStatus && 'enrolled' in enrollmentStatus && enrollmentStatus.enrolled && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2.5">
                                        <PlayCircle className="h-6 w-6 text-white fill-white/20" />
                                    </div>
                                </div>
                             )}
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Price / Status */}
                            <div>
                                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                                    Gratis
                                    <span className="text-xs font-normal text-zinc-400 ml-2 line-through">Rp 0</span>
                                </div>
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-0.5">Akses selamanya</p>
                            </div>

                            {/* Main CTA */}
                            {enrollmentStatus && 'enrolled' in enrollmentStatus && enrollmentStatus.enrolled ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                        <p className="text-xs font-semibold leading-tight">Anda sudah terdaftar</p>
                                    </div>
                                    <Button 
                                        className="w-full h-10 text-sm font-bold rounded-xl bg-zinc-900 hover:bg-black text-white shadow-lg shadow-zinc-200/50 transition-all" 
                                        onClick={handleContinueLearning}
                                    >
                                        {enrollmentStatus.status === 'selesai' ? 'Tinjau Materi' : 'Lanjutkan Belajar'}
                                        <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                                    </Button>
                                    {enrollmentStatus.status === 'selesai' && (
                                        <TombolUnduhSertifikat 
                                            idKursus={id!}
                                            persentaseKemajuan={100}
                                            judulKursus={course.judul}
                                        />
                                    )}
                                </div>
                            ) : (
                                <Button 
                                    className="w-full h-10 text-sm font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200/50 transition-all" 
                                    onClick={handleEnroll}
                                    disabled={enrollMutation.isPending}
                                >
                                    {enrollMutation.isPending ? 'Memproses...' : 'Daftar Sekarang'}
                                </Button>
                            )}

                            {/* Features List */}
                            <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <h4 className="font-bold text-xs text-zinc-900">Termasuk:</h4>
                                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                    <li className="flex items-center gap-2">
                                        <PlayCircle className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>{totalMateri} materi konten</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>Akses modul lengkap</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>Akses selamanya</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Share Button */}
                            <Button variant="outline" size="sm" className="w-full h-9 rounded-xl border-zinc-200 text-xs font-semibold text-zinc-600" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link kursus disalin!");
                            }}>
                                <Share2 className="h-3.5 w-3.5 mr-2" />
                                Bagikan
                            </Button>
                        </div>
                    </div>

                    {/* Instructor Mini Card */}
                    {course.instruktur && (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                {course.instruktur.url_foto ? (
                                    <img
                                        src={course.instruktur.url_foto}
                                        alt={course.instruktur.nama_lengkap}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-zinc-400 m-2.5" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Instruktur</p>
                                <p className="font-bold text-zinc-900 dark:text-white truncate text-sm">
                                    {course.instruktur.nama_lengkap}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
