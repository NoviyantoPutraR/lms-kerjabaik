import { Progress } from '@/komponen/ui/progress';
import { Card } from '@/komponen/ui/card';
import { Clock, CheckCircle2 } from 'lucide-react';

interface LearningProgressHeaderProps {
    totalMaterials: number;
    completedMaterials: number;
    estimatedTimeLeft: number; // in minutes
    courseTitle: string;
}

export function LearningProgressHeader({
    totalMaterials,
    completedMaterials,
    estimatedTimeLeft,
    courseTitle
}: LearningProgressHeaderProps) {
    const progressPercent = totalMaterials > 0
        ? (completedMaterials / totalMaterials) * 100
        : 0;

    const formatTime = (minutes: number): string => {
        if (minutes < 60) return `${minutes} menit`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}j ${mins}m` : `${hours} jam`;
    };

    return (
        <Card className="p-4 mb-6 rounded-sm shadow-sm border border-l-4 border-l-primary">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">
                            Progress Kursus
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {courseTitle}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-primary tracking-tight">
                            {Math.round(progressPercent)}%
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={progressPercent} className="h-2 rounded-sm" />

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>
                                {completedMaterials} dari {totalMaterials} materi selesai
                            </span>
                        </div>

                        {estimatedTimeLeft > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>~{formatTime(estimatedTimeLeft)} tersisa</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Milestone indicator */}
                {progressPercent >= 100 && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Selamat! Anda telah menyelesaikan semua materi</span>
                    </div>
                )}

                {progressPercent >= 50 && progressPercent < 100 && (
                    <div className="bg-sky-50 border border-sky-200 text-sky-700 text-xs px-3 py-2 rounded-sm">
                        Anda sudah setengah jalan! Terus semangat 💪
                    </div>
                )}
            </div>
        </Card>
    );
}
