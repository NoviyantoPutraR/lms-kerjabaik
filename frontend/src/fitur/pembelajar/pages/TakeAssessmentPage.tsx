import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    ChevronRight,
    ChevronLeft,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Skeleton } from '@/komponen/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/komponen/ui/dialog';
import {
    useAssessments,
    useStartAssessment,
    useSubmitAnswer,
    useFinishAssessment
} from '@/fitur/pembelajar/api/learnerApi';
import { QuestionRenderer } from '../komponen/QuestionRenderer';
import { toast } from 'sonner';
import { supabase } from '@/pustaka/supabase';

export function TakeAssessmentPage() {
    const { assessmentId, attemptId } = useParams<{ assessmentId: string; attemptId?: string }>();
    const navigate = useNavigate();

    const { data: assessments } = useAssessments();
    const startMutation = useStartAssessment();
    const submitAnswerMutation = useSubmitAnswer();
    const finishMutation = useFinishAssessment();

    const [currentAttempt, setCurrentAttempt] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const autoSaveTimerRef = useRef<NodeJS.Timeout>();
    const assessment = assessments?.find(a => a.id === assessmentId);

    // Load assessment data and questions
    useEffect(() => {
        const loadData = async () => {
            if (!assessmentId) return;

            try {
                // If attemptId provided, load existing attempt
                if (attemptId) {
                    const { data: attempt } = (await supabase
                        .from('percobaan_asesmen')
                        .select('*')
                        .eq('id', attemptId)
                        .single()) as { data: { id: string; waktu_mulai: string } | null };

                    if (attempt) {
                        setCurrentAttempt(attempt);

                        // Load existing answers
                        const { data: existingAnswers } = (await supabase
                            .from('jawaban')
                            .select('*')
                            .eq('id_percobaan', attemptId)) as { data: { id_soal: string; jawaban_pengguna: string | null; jawaban_pengguna_multiple: any }[] | null };

                        const answersMap: Record<string, string | string[]> = {};
                        existingAnswers?.forEach(ans => {
                            answersMap[ans.id_soal] = ans.jawaban_pengguna_multiple || ans.jawaban_pengguna || '';
                        });
                        setAnswers(answersMap);

                        // Calculate remaining time
                        if (assessment?.durasi_menit) {
                            const startTime = new Date(attempt.waktu_mulai).getTime();
                            const now = Date.now();
                            const elapsed = Math.floor((now - startTime) / 1000);
                            const total = assessment.durasi_menit * 60;
                            setTimeRemaining(Math.max(0, total - elapsed));
                        }
                    }
                } else {
                    // Start new attempt
                    const newAttempt = await startMutation.mutateAsync(assessmentId);
                    setCurrentAttempt(newAttempt);

                    if (assessment?.durasi_menit) {
                        setTimeRemaining(assessment.durasi_menit * 60);
                    }
                }

                // Load questions
                const { data: soal } = (await supabase
                    .from('soal')
                    .select('*')
                    .eq('id_asesmen', assessmentId)
                    .order('urutan', { ascending: true })) as { data: any[] | null };

                if (soal) {
                    // Shuffle if required
                    const finalQuestions = assessment?.acak_soal
                        ? soal.sort(() => Math.random() - 0.5)
                        : soal;
                    setQuestions(finalQuestions);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error loading assessment:', error);
                toast.error('Gagal memuat ujian');
                navigate('/pembelajar/assessments');
            }
        };

        loadData();
    }, [assessmentId, attemptId, assessment]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining]);

    // Auto-save answers
    const saveAnswer = useCallback(async (questionId: string, answer: string | string[]) => {
        if (!currentAttempt) return;

        try {
            await submitAnswerMutation.mutateAsync({
                percobaanId: currentAttempt.id,
                soalId: questionId,
                jawabanPengguna: typeof answer === 'string' ? answer : undefined,
                jawabanPenggunaMultiple: Array.isArray(answer) ? answer : undefined,
            });
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, [currentAttempt, submitAnswerMutation]);

    // Debounced auto-save
    const handleAnswerChange = (questionId: string, answer: string | string[]) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));

        // Clear existing timer
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // Set new timer for auto-save
        autoSaveTimerRef.current = setTimeout(() => {
            saveAnswer(questionId, answer);
        }, 2000);
    };

    const handleAutoSubmit = async () => {
        if (!currentAttempt) return;

        toast.info('Waktu habis! Ujian akan dikumpulkan otomatis...');
        await handleSubmit();
    };

    const handleSubmit = async () => {
        if (!currentAttempt) return;

        try {
            // Save all pending answers
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }

            // Finish assessment
            await finishMutation.mutateAsync(currentAttempt.id);

            toast.success('Ujian berhasil dikumpulkan!');
            navigate(`/pembelajar/penilaian/${assessmentId}/results`);
        } catch (error) {
            toast.error('Gagal mengumpulkan ujian');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).filter(k => answers[k]).length;
    const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    if (isLoading) {
        return <Skeleton className="h-screen w-full" />;
    }

    if (!assessment || !currentAttempt) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Assessment not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{assessment.judul}</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Soal {currentQuestionIndex + 1} dari {questions.length}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {timeRemaining !== null && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-sm border ${timeRemaining < 300
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-muted border-transparent'
                                    }`}>
                                    <Clock className="h-4 w-4" />
                                    <span className="font-mono font-bold tracking-tight">{formatTime(timeRemaining)}</span>
                                </div>
                            )}

                            <Button
                                variant="default"
                                onClick={() => setShowSubmitDialog(true)}
                            >
                                Kumpulkan
                            </Button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>{answeredCount} dari {questions.length} soal terjawab</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-sm overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 rounded-sm"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="container max-w-5xl mx-auto px-4 py-8">
                {currentQuestion && (
                    <QuestionRenderer
                        question={currentQuestion}
                        answer={answers[currentQuestion.id]}
                        onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                    />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Sebelumnya
                    </Button>

                    <div className="flex gap-2 flex-wrap justify-center">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`w-10 h-10 rounded-sm border transition-colors ${index === currentQuestionIndex
                                    ? 'border-primary bg-primary text-primary-foreground font-medium shadow-sm'
                                    : answers[questions[index].id]
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                                        : 'border-border hover:border-primary/50 text-muted-foreground'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kumpulkan Ujian?</DialogTitle>
                        <DialogDescription>
                            Anda telah menjawab {answeredCount} dari {questions.length} soal.
                            {answeredCount < questions.length && (
                                <span className="block mt-2 text-yellow-600">
                                    <AlertCircle className="inline h-4 w-4 mr-1" />
                                    Masih ada {questions.length - answeredCount} soal yang belum dijawab.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit}>
                            Ya, Kumpulkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
