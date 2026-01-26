import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    File,
    X,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/komponen/ui/card';
import { Badge } from '@/komponen/ui/badge';
import { Textarea } from '@/komponen/ui/textarea';
import { Label } from '@/komponen/ui/label';
import { Skeleton } from '@/komponen/ui/skeleton';
import { useAssignments, useSubmitAssignment } from '@/fitur/pembelajar/api/learnerApi';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function AssignmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: assignments, isLoading } = useAssignments();
    const submitMutation = useSubmitAssignment();

    const [file, setFile] = useState<File | null>(null);
    const [catatan, setCatatan] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const assignment = assignments?.find(a => a.id === id);
    const submission = assignment?.pengumpulan_tugas;
    const isSubmitted = !!submission;
    const isWaitingForGrade = submission?.status === 'dikumpulkan';
    const isGraded = submission?.status === 'dinilai';
    const needsRevision = submission?.status === 'perlu_revisi';

    // Auto-save draft catatan
    useEffect(() => {
        const timer = setTimeout(() => {
            if (catatan && !isSubmitted) {
                localStorage.setItem(`assignment-draft-${id}`, catatan);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [catatan, id, isSubmitted]);

    // Restore draft on mount
    useEffect(() => {
        const draft = localStorage.getItem(`assignment-draft-${id}`);
        if (draft && !submission) {
            setCatatan(draft);
            toast.info('Draft catatan dipulihkan');
        }
    }, [id, submission]);

    // Warn before leave if unsaved
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if ((catatan || file) && !isSubmitted) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [catatan, file, isSubmitted]);

    const validateFile = (file: File): string | null => {
        if (!assignment) return "Assignment data not loaded yet.";

        const maxSize = assignment.max_file_size || 10485760; // 10MB default
        if (file.size > maxSize) {
            return `File terlalu besar. Maksimal ${(maxSize / 1024 / 1024).toFixed(0)}MB. File Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        const allowed = assignment.allowed_extensions || ['pdf', 'doc', 'docx'];
        if (!ext || !allowed.includes(ext)) {
            return `Format file tidak didukung. Gunakan: ${allowed.join(', ')}. File Anda: .${ext}`;
        }

        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const error = validateFile(selectedFile);
        if (error) {
            toast.error(error);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setFile(selectedFile);
        toast.success(`File "${selectedFile.name}" siap diupload`);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        const error = validateFile(droppedFile);
        if (error) {
            toast.error(error);
            return;
        }

        setFile(droppedFile);
        toast.success(`File "${droppedFile.name}" siap diupload`);
    };

    const handleSubmit = async () => {
        if (!file && !needsRevision && !isSubmitted) {
            toast.error('Mohon pilih file tugas terlebih dahulu');
            return;
        }

        if (needsRevision && !file) {
            toast.error('Mohon lampirkan file revisi Anda');
            return;
        }

        try {
            if (file) {
                await submitMutation.mutateAsync({
                    tugasId: id!,
                    file,
                    catatan
                });
                toast.success('Tugas berhasil dikumpulkan!');
                navigate('/pembelajar/assessments');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Gagal mengumpulkan tugas');
        }
    };

    if (isLoading) return <Skeleton className="h-96 w-full" />;
    if (!assignment) return <div>Tugas tidak ditemukan</div>;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/pembelajar/assessments')} className="mb-4 pl-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Pusat Asesmen
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="rounded-sm">{assignment.asesmen?.kursus?.judul}</Badge>
                                {isGraded && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm rounded-sm hover:bg-emerald-100">Dinilai: {submission.nilai}/100</Badge>}
                            </div>
                            <CardTitle className="text-2xl">{assignment.judul}</CardTitle>
                        </div>
                        {assignment.deadline && (
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Tenggat Waktu</p>
                                <p className="font-medium text-red-600">
                                    {format(new Date(assignment.deadline), 'd MMMM yyyy, HH:mm', { locale: localeId })}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Deskripsi Tugas</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">{assignment.deskripsi}</p>
                    </div>
                </CardHeader>
            </Card>

            {!isGraded && (
                <Card className="rounded-sm shadow-sm">
                    <CardHeader>
                        <CardTitle>Pengumpulan Tugas</CardTitle>
                        <CardDescription>
                            Upload file tugas Anda dalam format PDF atau DOCX (Max 10MB)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {needsRevision && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3 mb-2">
                                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-amber-800 text-sm">Perlu Revisi</p>
                                    <p className="text-amber-700 text-sm mt-1">
                                        Instruktur meminta revisi untuk tugas Anda. Silakan perbaiki dan unggah kembali file tugas terbaru.
                                    </p>
                                    {submission?.feedback && (
                                        <div className="mt-2 pt-2 border-t border-amber-200">
                                            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Feedback Instruktur:</p>
                                            <p className="text-sm text-amber-700 italic mt-1 font-medium font-serif italic">"{submission.feedback}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {isWaitingForGrade && !file ? (
                            <div className="bg-muted/50 p-4 rounded-sm flex items-center justify-between border">
                                <div className="flex items-center gap-3">
                                    <File className="h-8 w-8 text-sky-500" />
                                    <div>
                                        <p className="font-medium">File Terkirim</p>
                                        <a
                                            href={submission.url_berkas}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-sky-600 hover:underline"
                                        >
                                            Lihat file saya
                                        </a>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-muted-foreground">
                                    Dikumpulkan pada:<br />
                                    {submission.created_at && format(new Date(submission.created_at), 'd MMM HH:mm')}
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                    }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <File className="h-10 w-10 text-primary mb-2" />
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                            <X className="h-4 w-4 mr-2" />
                                            Ganti File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                                        <p className="font-medium mb-1">Klik untuk upload atau drag & drop</p>
                                        <p className="text-sm text-muted-foreground">PDF, DOCX up to 10MB</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Catatan (Opsional)</Label>
                            <Textarea
                                placeholder="Tambahkan catatan untuk instruktur..."
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                disabled={isWaitingForGrade && !file}
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={submitMutation.isPending || (isWaitingForGrade && !file)}
                        >
                            {submitMutation.isPending
                                ? 'Mengirim...'
                                : isWaitingForGrade && !file
                                    ? 'Menunggu Penilaian'
                                    : needsRevision
                                        ? 'Kumpulkan Revisi'
                                        : 'Kumpulkan Tugas'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isGraded && (
                <Card className="rounded-sm shadow-sm border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="h-5 w-5" />
                            <CardTitle>Hasil Penilaian</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center bg-background p-4 rounded-sm shadow-sm border border-emerald-100">
                            <span className="font-medium">Nilai Akhir</span>
                            <span className="text-2xl font-bold text-emerald-600">{submission.nilai}/100</span>
                        </div>
                        {submission.feedback && (
                            <div className="bg-background p-4 rounded-sm shadow-sm border border-emerald-100">
                                <p className="text-sm font-medium mb-1 text-muted-foreground">Feedback Instruktur</p>
                                <p>{submission.feedback}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

