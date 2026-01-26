import { Card, CardContent, CardFooter, CardHeader } from '@/komponen/ui/card';
import { Badge } from '@/komponen/ui/badge';
import { Progress } from '@/komponen/ui/progress';
import { Button } from '@/komponen/ui/button';
import { BookOpen, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Enrollment } from '../tipe';

interface CourseCardProps {
    enrollment: Enrollment;
    onContinue?: (enrollmentId: string) => void;
}

/**
 * Komponen card untuk menampilkan kursus yang diikuti
 */
export function CourseCard({ enrollment, onContinue }: CourseCardProps) {
    const { kursus, persentase_kemajuan, status } = enrollment;

    if (!kursus) return null;

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'aktif':
                return 'default';
            case 'selesai':
                return 'secondary';
            case 'dibatalkan':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getTingkatColor = (tingkat?: string) => {
        switch (tingkat) {
            case 'pemula':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'menengah':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'lanjutan':
                return 'bg-rose-50 text-rose-700 border border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border border-slate-200';
        }
    };

    return (
        <Card className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-border group">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                {kursus.url_gambar_mini ? (
                    <img
                        src={kursus.url_gambar_mini}
                        alt={kursus.judul}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white/50" />
                    </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <Badge variant={getBadgeVariant(status)} className="rounded-md shadow-sm">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-3">
                <div className="space-y-2">
                    {/* Kategori & Tingkat */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {kursus.kategori && (
                            <Badge variant="outline" className="text-xs rounded-md bg-background">
                                {kursus.kategori}
                            </Badge>
                        )}
                        {kursus.tingkat && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${getTingkatColor(kursus.tingkat)}`}>
                                {kursus.tingkat.charAt(0).toUpperCase() + kursus.tingkat.slice(1)}
                            </span>
                        )}
                    </div>

                    {/* Judul */}
                    <h3 className="font-semibold text-lg line-clamp-2">
                        {kursus.judul}
                    </h3>


                    {/* Deskripsi */}
                    {kursus.deskripsi && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {kursus.deskripsi}
                        </p>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                {/* Instruktur */}
                {kursus.instruktur && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="h-4 w-4" />
                        <span>{kursus.instruktur.nama_lengkap}</span>
                    </div>
                )}

                {/* Durasi */}
                {kursus.durasi_menit && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(kursus.durasi_menit / 60)}j {kursus.durasi_menit % 60}m</span>
                    </div>
                )}

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round(persentase_kemajuan)}%</span>
                    </div>
                    <Progress value={persentase_kemajuan} className="h-2" />
                </div>
            </CardContent>

            <CardFooter>
                {status === 'aktif' ? (
                    <Button
                        className="w-full rounded-md shadow-sm"
                        onClick={() => onContinue?.(enrollment.id)}
                        asChild
                    >
                        <Link to={`/pembelajar/learn/${enrollment.id}`}>
                            Lanjutkan Belajar
                        </Link>
                    </Button>
                ) : status === 'selesai' ? (
                    <Button
                        className="w-full rounded-md"
                        variant="outline"
                        asChild
                    >
                        <Link to={`/pembelajar/kursus/${kursus.id}`}>
                            Lihat Detail
                        </Link>
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        variant="secondary"
                        disabled
                    >
                        Dibatalkan
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
