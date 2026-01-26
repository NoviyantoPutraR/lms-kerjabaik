import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/komponen/ui/card';
import { Badge } from '@/komponen/ui/badge';
import { Progress } from '@/komponen/ui/progress';
import { Skeleton } from '@/komponen/ui/skeleton';
import { supabase } from '@/pustaka/supabase';
import { QuestionRenderer } from '../komponen/QuestionRenderer';
import type { AssessmentAttempt, Question, Answer } from '../tipe';

export function AssessmentResultsPage() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [assessment, setAssessment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, [assessmentId]);

    const loadResults = async () => {
        if (!assessmentId) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: pengguna } = await supabase
                .from('pengguna')
                .select('id')
                .eq('auth_id', user.id)
                .single<{ id: string }>();

            if (!pengguna) throw new Error('Pengguna not found');

            // Load assessment info
            const { data: assessmentData } = await supabase
                .from('asesmen')
                .select('*')
                .eq('id', assessmentId)
                .single();

            setAssessment(assessmentData);

            // Load latest attempt
            const { data: attemptData, error: attemptError } = await supabase
                .from('percobaan_asesmen')
                .select('*')
                .eq('id_asesmen', assessmentId)
                .eq('id_pengguna', pengguna.id)
                .eq('status', 'selesai')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (attemptError || !attemptData) {
                console.error('No finished attempt found', attemptError);
                navigate(`/pembelajar/penilaian/${assessmentId}`);
                return;
            }

            const currentAttempt = attemptData as AssessmentAttempt;
            setAttempt(currentAttempt);

            // Load questions
            const { data: questionsData } = await supabase
                .from('soal')
                .select('*')
                .eq('id_asesmen', assessmentId)
                .order('urutan', { ascending: true });

            setQuestions(questionsData as Question[] || []);

            // Load answers
            const { data: answersData } = await supabase
                .from('jawaban')
                .select('*')
                .eq('id_percobaan', currentAttempt.id);

            setAnswers(answersData as Answer[] || []);

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading results:', error);
            navigate(`/pembelajar/assessments`);
        }
    };

    const getAnswerForQuestion = (questionId: string) => {
        return answers.find(a => a.id_soal === questionId);
    };

    const correctCount = answers.filter(a => a.benar === true).length;
    const incorrectCount = answers.filter(a => a.benar === false).length;
    const unansweredCount = questions.length - answers.length;
    const isPassed = (attempt?.nilai || 0) >= (assessment?.nilai_kelulusan || 70);

    if (isLoading) {
        return <Skeleton className="h-screen w-full" />;
    }

    if (!attempt || !assessment) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Hasil tidak ditemukan</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/pembelajar/assessments')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Asesmen
                    </Button>

                    <h1 className="text-3xl font-bold">{assessment.judul}</h1>
                    <p className="text-muted-foreground mt-2">Hasil Ujian</p>
                </div>

                {/* Score Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Nilai Anda</span>
                            <Badge variant={isPassed ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                                {isPassed ? (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 mr-2" />
                                        LULUS
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-5 w-5 mr-2" />
                                        TIDAK LULUS
                                    </>
                                )}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="text-6xl font-bold text-primary mb-2">
                                {Math.round(attempt.nilai || 0)}
                            </div>
                            <p className="text-muted-foreground">
                                Passing Score: {assessment.nilai_kelulusan}
                            </p>
                        </div>

                        <Progress value={attempt.nilai || 0} className="h-3 mb-6" />

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {correctCount}
                                </div>
                                <p className="text-sm text-muted-foreground">Benar</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {incorrectCount}
                                </div>
                                <p className="text-sm text-muted-foreground">Salah</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/10 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                    {unansweredCount}
                                </div>
                                <p className="text-sm text-muted-foreground">Tidak Dijawab</p>
                            </div>
                        </div>

                        {assessment.tampilkan_jawaban && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900 dark:text-blue-100">
                                            Pembahasan Tersedia
                                        </p>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Scroll ke bawah untuk melihat pembahasan setiap soal
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Questions Review */}
                {assessment.tampilkan_jawaban && (<div className="space-y-6">
                    <h2 className="text-2xl font-bold">Pembahasan Soal</h2>
                    {questions.map((question, index) => {
                        const answer = getAnswerForQuestion(question.id);
                        const userAnswer = answer?.jawaban_pengguna_multiple || answer?.jawaban_pengguna;

                        return (
                            <div key={question.id} className="relative">
                                <div className="absolute -left-4 top-6">
                                    {answer?.benar === true ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    ) : answer?.benar === false ? (
                                        <XCircle className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <AlertCircle className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Badge variant="outline">Soal {index + 1}</Badge>
                                        {answer && (
                                            <Badge variant={answer.benar ? 'default' : 'destructive'}>
                                                {answer.poin_diperoleh}/{question.poin} poin
                                            </Badge>
                                        )}
                                    </div>
                                    <QuestionRenderer
                                        question={question}
                                        answer={userAnswer}
                                        onAnswerChange={() => { }}
                                        disabled={true}
                                        showCorrectAnswer={true}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/pembelajar/assessments')}
                    >
                        Kembali ke Daftar
                    </Button>
                    {assessment.jumlah_percobaan === -1 ||
                        (attempt.nomor_percobaan < assessment.jumlah_percobaan) ? (
                        <Button
                            onClick={() => navigate(`/pembelajar/penilaian/${assessmentId}`)}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Coba Lagi
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
