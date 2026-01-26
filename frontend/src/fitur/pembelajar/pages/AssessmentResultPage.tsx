import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Trophy,
    XCircle,
    CheckCircle2,
    ArrowLeft,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/komponen/ui/card';
import { Badge } from '@/komponen/ui/badge';
import { Skeleton } from '@/komponen/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/komponen/ui/tabs';
import {
    useAssessments,
    useAssessmentAttempts,
    useStartAssessment
} from '@/fitur/pembelajar/api/learnerApi';
import { QuestionRenderer } from '../komponen/QuestionRenderer';
import { supabase } from '@/pustaka/supabase';
import { toast } from 'sonner';

export function AssessmentResultPage() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const navigate = useNavigate();

    const { data: assessments } = useAssessments();
    const { data: attempts } = useAssessmentAttempts(assessmentId || '');
    const startMutation = useStartAssessment();

    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const assessment = assessments?.find(a => a.id === assessmentId);
    const latestAttempt = attempts?.[0]; // Already sorted by nomor_percobaan desc
    const bestAttempt = attempts?.reduce((best, current) =>
        (current.nilai || 0) > (best.nilai || 0) ? current : best
        , attempts[0]);

    const canRetry = assessment && (
        assessment.jumlah_percobaan === -1 ||
        (attempts?.length || 0) < assessment.jumlah_percobaan
    );

    const isPassed = (latestAttempt?.nilai || 0) >= (assessment?.nilai_kelulusan || 0);

    useEffect(() => {
        const loadResults = async () => {
            if (!assessmentId || !latestAttempt) return;

            try {
                // Load questions
                const { data: soal } = await supabase
                    .from('soal')
                    .select('*')
                    .eq('id_asesmen', assessmentId)
                    .order('urutan', { ascending: true });

                setQuestions(soal || []);

                // Load answers
                const { data: jawaban } = await supabase
                    .from('jawaban')
                    .select('*')
                    .eq('id_percobaan', latestAttempt.id);

                setAnswers(jawaban || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading results:', error);
                toast.error('Gagal memuat hasil ujian');
            }
        };

        loadResults();
    }, [assessmentId, latestAttempt]);

    const handleRetry = async () => {
        if (!assessmentId) return;

        try {
            const newAttempt = await startMutation.mutateAsync(assessmentId);
            navigate(`/pembelajar/penilaian/${assessmentId}/take/${newAttempt.id}`);
        } catch (error) {
            toast.error('Gagal memulai percobaan baru');
        }
    };

    if (isLoading || !assessment || !latestAttempt) {
        return <Skeleton className="h-screen w-full" />;
    }

    const totalQuestions = questions.length;
    const correctAnswers = answers.filter(a => a.benar).length;
    const score = latestAttempt.nilai || 0;

    return (
        <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/pembelajar/assessments')}
                    className="pl-0"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Ujian
                </Button>
            </div>

            {/* Result Card */}
            <Card className={`rounded-sm shadow-sm border-2 ${isPassed ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10'}`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isPassed ? (
                                <Trophy className="h-10 w-10 text-emerald-600" />
                            ) : (
                                <XCircle className="h-10 w-10 text-rose-600" />
                            )}
                            <div>
                                <CardTitle className="text-2xl">
                                    {isPassed ? 'Selamat! Anda Lulus' : 'Belum Lulus'}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {assessment.judul}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-4xl font-bold tracking-tight ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {score}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Passing score: {assessment.nilai_kelulusan}%
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold">{totalQuestions}</div>
                            <div className="text-sm text-muted-foreground">Total Soal</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-600">{correctAnswers}</div>
                            <div className="text-sm text-muted-foreground">Benar</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-rose-600">{totalQuestions - correctAnswers}</div>
                            <div className="text-sm text-muted-foreground">Salah</div>
                        </div>
                    </div>

                    {canRetry && (
                        <div className="mt-6 flex gap-2 justify-center">
                            <Button onClick={handleRetry}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Coba Lagi
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attempts History */}
            {attempts && attempts.length > 1 && (<Card>
                <CardHeader>
                    <CardTitle>Riwayat Percobaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {attempts.map((attempt, _index) => (
                            <div
                                key={attempt.id}
                                className="flex items-center justify-between p-3 rounded-sm border"
                            >
                                <div className="flex items-center gap-3">
                                    <Badge variant={attempt.id === bestAttempt?.id ? 'default' : 'secondary'}>
                                        Percobaan {attempt.nomor_percobaan}
                                    </Badge>
                                    {attempt.id === latestAttempt.id && (
                                        <Badge variant="outline">Terbaru</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(attempt.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                    <span className={`font-bold ${(attempt.nilai || 0) >= assessment.nilai_kelulusan
                                        ? 'text-emerald-600'
                                        : 'text-rose-600'
                                        }`}>
                                        {attempt.nilai || 0}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            )}

            {/* Review Answers */}
            {assessment.tampilkan_jawaban && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Jawaban</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all">Semua ({totalQuestions})</TabsTrigger>
                                <TabsTrigger value="correct">Benar ({correctAnswers})</TabsTrigger>
                                <TabsTrigger value="wrong">Salah ({totalQuestions - correctAnswers})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="space-y-4 mt-6">
                                {questions.map((question, index) => {
                                    const answer = answers.find(a => a.id_soal === question.id);
                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Soal {index + 1}</span>
                                                {answer?.benar ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm rounded-sm hover:bg-emerald-100">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Benar
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="rounded-sm shadow-sm">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Salah
                                                    </Badge>
                                                )}
                                            </div>
                                            <QuestionRenderer
                                                question={question}
                                                answer={answer?.jawaban_pengguna_multiple || answer?.jawaban_pengguna || ''}
                                                onAnswerChange={() => { }}
                                                disabled
                                                showCorrectAnswer
                                            />
                                        </div>
                                    );
                                })}
                            </TabsContent>

                            <TabsContent value="correct" className="space-y-4 mt-6">
                                {questions.filter((q) => {
                                    const answer = answers.find(a => a.id_soal === q.id);
                                    return answer?.benar;
                                }).map((question, _index) => {
                                    const answer = answers.find(a => a.id_soal === question.id);
                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Soal {questions.indexOf(question) + 1}</span>
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm rounded-sm hover:bg-emerald-100">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Benar
                                                </Badge>
                                            </div>
                                            <QuestionRenderer
                                                question={question}
                                                answer={answer?.jawaban_pengguna_multiple || answer?.jawaban_pengguna || ''}
                                                onAnswerChange={() => { }}
                                                disabled
                                                showCorrectAnswer
                                            />
                                        </div>
                                    );
                                })}
                            </TabsContent>

                            <TabsContent value="wrong" className="space-y-4 mt-6">
                                {questions.filter((q) => {
                                    const answer = answers.find(a => a.id_soal === q.id);
                                    return !answer?.benar;
                                }).map((question, _index) => {
                                    const answer = answers.find(a => a.id_soal === question.id);
                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Soal {questions.indexOf(question) + 1}</span>
                                                <Badge variant="destructive" className="rounded-sm shadow-sm">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Salah
                                                </Badge>
                                            </div>
                                            <QuestionRenderer
                                                question={question}
                                                answer={answer?.jawaban_pengguna_multiple || answer?.jawaban_pengguna || ''}
                                                onAnswerChange={() => { }}
                                                disabled
                                                showCorrectAnswer
                                            />
                                        </div>
                                    );
                                })}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
