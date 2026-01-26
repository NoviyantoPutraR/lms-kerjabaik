
import {
    CheckCircle,
    PlayCircle,
    FileText,
    Lock
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/komponen/ui/accordion';
import { ScrollArea } from '@/komponen/ui/scroll-area';
import { cn } from '@/pustaka/utils';
import type { Course, MaterialProgress } from '../tipe';

interface LearningSidebarProps {
    course: Course;
    progress: MaterialProgress[];
    currentMaterialId?: string;
    onSelectMaterial: (materialId: string) => void;
    className?: string;
}

export function LearningSidebar({
    course,
    progress,
    currentMaterialId,
    onSelectMaterial,
    className,
}: LearningSidebarProps) {
    // Group progress by id_materi for easy lookup
    const progressMap = progress.reduce((acc, p) => {
        acc[p.id_materi] = p;
        return acc;
    }, {} as Record<string, MaterialProgress>);

    const getMaterialIcon = (type: string, isCompleted: boolean) => {
        if (isCompleted) return <CheckCircle className="h-4 w-4 text-green-500" />;

        switch (type) {
            case 'video':
                return <PlayCircle className="h-4 w-4" />;
            case 'dokumen':
            case 'teks':
            default:
                return <FileText className="h-4 w-4" />;
        }
    };



    return (
        <div className={cn("flex flex-col h-full border-r border-primary-foreground/10 bg-primary text-primary-foreground", className)}>
            <div className="p-4 border-b border-primary-foreground/10">
                <h2 className="font-semibold text-lg line-clamp-1">{course.judul}</h2>
                <p className="text-sm text-primary-foreground/70 mt-1">
                    {Math.round((progress.filter(p => p.status === 'selesai').length / (course.modul?.reduce((acc, m) => acc + (m.materi?.length || 0), 0) || 1)) * 100)}% Selesai
                </p>
            </div>

            <ScrollArea className="flex-1">
                <Accordion
                    type="multiple"
                    defaultValue={course.modul?.map(m => m.id)}
                    className="w-full"
                >
                    {course.modul?.sort((a, b) => a.urutan - b.urutan).map((modul, index) => (
                        <AccordionItem key={modul.id} value={modul.id} className="border-primary-foreground/10">
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 data-[state=open]:bg-white/5">
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium">
                                        Modul {index + 1}: {modul.judul}
                                    </span>
                                    <span className="text-xs text-primary-foreground/60 font-normal">
                                        {modul.materi?.length || 0} Materi
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                                <div className="flex flex-col">
                                    {modul.materi?.sort((a, b) => a.urutan - b.urutan).map((materi) => {
                                        const prog = progressMap[materi.id];
                                        const isCompleted = prog?.status === 'selesai';
                                        const isCurrent = currentMaterialId === materi.id;
                                        const isLocked = false; // TODO: Implement lock logic

                                        return (
                                            <button
                                                key={materi.id}
                                                onClick={() => !isLocked && onSelectMaterial(materi.id)}
                                                disabled={isLocked}
                                                className={cn(
                                                    "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-[3px]",
                                                    isCurrent
                                                        ? "bg-accent/10 border-accent text-accent-foreground font-medium"
                                                        : "border-transparent text-primary-foreground/80 hover:bg-white/5 hover:text-white",
                                                    isLocked && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <div className={cn(
                                                    isCurrent ? "text-accent" : isCompleted ? "text-green-400" : "text-primary-foreground/50"
                                                )}>
                                                    {getMaterialIcon(materi.tipe, isCompleted)}
                                                </div>
                                                <span className={cn(
                                                    "flex-1 text-left line-clamp-2",
                                                    isCurrent ? "text-white" : ""
                                                )}>
                                                    {materi.judul}
                                                </span>
                                                {materi.durasi_menit && (
                                                    <span className="text-xs text-primary-foreground/50">
                                                        {materi.durasi_menit}m
                                                    </span>
                                                )}
                                                {isLocked && <Lock className="h-3 w-3 text-primary-foreground/30" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    );
}
