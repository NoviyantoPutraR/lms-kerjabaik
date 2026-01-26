import { RadioGroup, RadioGroupItem } from '@/komponen/ui/radio-group';
import { Checkbox } from '@/komponen/ui/checkbox';
import { Textarea } from '@/komponen/ui/textarea';
import { Input } from '@/komponen/ui/input';
import { Label } from '@/komponen/ui/label';
import { Card, CardContent } from '@/komponen/ui/card';
import type { Question, QuestionOption } from '../tipe';

interface QuestionRendererProps {
    question: Question;
    answer?: string | string[];
    onAnswerChange: (answer: string | string[]) => void;
    disabled?: boolean;
    showCorrectAnswer?: boolean;
}

export function QuestionRenderer({
    question,
    answer,
    onAnswerChange,
    disabled = false,
    showCorrectAnswer = false
}: QuestionRendererProps) {
    const parseOptions = (opsi: any): QuestionOption[] => {
        let options: QuestionOption[] = [];
        if (!opsi) return [];

        try {
            let parsed = opsi;

            // Try parsing if string (handle potential double-stringification)
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch {
                    // ignore parse error, use original string
                }
            }
            // Second pass for double stringified JSON (common in some CSV imports)
            if (typeof parsed === 'string') {
                try {
                    parsed = JSON.parse(parsed);
                } catch {
                    // ignore
                }
            }

            if (Array.isArray(parsed)) {
                options = parsed.map((opt: any, idx: number) => {
                    // Handle simple string/number array ["A", "B"]
                    if (typeof opt === 'string' || typeof opt === 'number') {
                        return {
                            key: `${idx}`,
                            value: String(opt),
                            benar: false
                        };
                    }
                    // Handle object {key: 'a', value: 'b'}
                    return {
                        key: String(opt.key || opt.code || idx),
                        value: String(opt.value || opt.text || opt.label || JSON.stringify(opt)),
                        benar: !!(opt.benar || opt.isCorrect)
                    };
                });
            } else if (typeof parsed === 'object' && parsed !== null) {
                // Check if the object WRAPS the actual array (common mistake)
                // e.g. { "opsi": [...] } or { "pilihan": [...] }
                const possibleArray = parsed.opsi || parsed.options || parsed.pilihan || parsed.choices || parsed.data;
                if (Array.isArray(possibleArray)) {
                    // Recurse or just handle logic here. Let's duplichate the array logic for safety without recursion limit
                    options = possibleArray.map((opt: any, idx: number) => {
                        if (typeof opt === 'string' || typeof opt === 'number') {
                            return { key: `${idx}`, value: String(opt), benar: false };
                        }
                        return {
                            key: String(opt.key || opt.code || idx),
                            value: String(opt.value || opt.text || opt.label || JSON.stringify(opt)),
                            benar: !!(opt.benar || opt.isCorrect)
                        };
                    });
                } else {
                    // Handle genuine object map {"a": "Text", "b": "Text2"}
                    options = Object.entries(parsed).map(([k, v]: [string, any]) => {
                        let val = '';
                        let isCorrect = false;

                        if (typeof v === 'object' && v !== null) {
                            val = v.value || v.text || v.label || JSON.stringify(v);
                            isCorrect = !!v.benar;
                        } else {
                            val = String(v);
                        }

                        return {
                            key: k,
                            value: val,
                            benar: isCorrect
                        };
                    });
                }
            }
        } catch (e) {
            console.error('Error parsing options:', e);
            return [];
        }

        return options;
    };

    const renderPilihanGanda = () => {
        const options = parseOptions(question.opsi);

        // Debug fallback: If somehow we still get 1 compressed option or 0, show Raw Data
        if (!options || options.length < 2) {
            console.warn('Suspicious options count:', options.length, question.opsi);
            return (
                <div className="space-y-4">
                    <div className="text-red-500 font-bold">
                        Warning: Format opsi soal tidak dikenali (Ditemukan {options.length} opsi).
                    </div>
                    {options.length > 0 && (
                        <RadioGroup className="space-y-3" disabled>
                            {options.map((option) => (
                                <div key={option.key} className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50">
                                    {/* Show what we parsed to verify */}
                                    <RadioGroupItem value={option.key} id={`bad-${option.key}`} />
                                    <Label>{option.value}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    <details className="mt-2 text-xs bg-slate-100 p-2 rounded">
                        <summary className="cursor-pointer font-medium mb-1">Lihat Raw Data (Untuk Debugging)</summary>
                        <pre className="whitespace-pre-wrap text-slate-700">
                            {typeof question.opsi === 'string' ? question.opsi : JSON.stringify(question.opsi, null, 2)}
                        </pre>
                    </details>
                </div>
            );
        }

        return (
            <RadioGroup
                value={answer as string}
                onValueChange={onAnswerChange}
                disabled={disabled}
                className="space-y-3"
            >
                {options.map((option) => (
                    <div
                        key={option.key}
                        className={`flex items-center space-x-3 p-3 rounded-sm border transition-colors ${showCorrectAnswer && option.benar
                            ? 'bg-emerald-50 border-emerald-500'
                            : showCorrectAnswer && answer === option.key && !option.benar
                                ? 'bg-rose-50 border-rose-500'
                                : 'hover:bg-muted'
                            }`}
                    >
                        <RadioGroupItem value={option.key} id={`option-${option.key}`} />
                        <Label
                            htmlFor={`option-${option.key}`}
                            className="flex-1 cursor-pointer font-normal text-base leading-relaxed"
                        >
                            {option.value}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    };

    const renderPilihanGandaMultiple = () => {
        const options = parseOptions(question.opsi);
        const selectedAnswers = (answer as string[]) || [];

        if (!options || options.length === 0) {
            console.warn('No options found for question:', question.id, question.opsi);
        }

        const handleCheckboxChange = (optionKey: string, checked: boolean) => {
            if (checked) {
                onAnswerChange([...selectedAnswers, optionKey]);
            } else {
                onAnswerChange(selectedAnswers.filter(a => a !== optionKey));
            }
        };

        return (
            <div className="space-y-3">
                {options.map((option) => (
                    <div
                        key={option.key}
                        className={`flex items-center space-x-3 p-3 rounded-sm border transition-colors ${showCorrectAnswer && option.benar
                            ? 'bg-emerald-50 border-emerald-500'
                            : showCorrectAnswer && selectedAnswers.includes(option.key) && !option.benar
                                ? 'bg-rose-50 border-rose-500'
                                : 'hover:bg-muted'
                            }`}
                    >
                        <Checkbox
                            id={`option-${option.key}`}
                            checked={selectedAnswers.includes(option.key)}
                            onCheckedChange={(checked) => handleCheckboxChange(option.key, checked as boolean)}
                            disabled={disabled}
                        />
                        <Label
                            htmlFor={`option-${option.key}`}
                            className="flex-1 cursor-pointer font-normal text-base leading-relaxed"
                        >
                            {option.value}
                        </Label>
                    </div>
                ))}
            </div>
        );
    };

    const renderBenarSalah = () => {
        return (
            <RadioGroup
                value={answer as string}
                onValueChange={onAnswerChange}
                disabled={disabled}
                className="space-y-3"
            >
                <div
                    className={`flex items-center space-x-3 p-3 rounded-sm border transition-colors ${showCorrectAnswer && question.jawaban_benar === 'benar'
                        ? 'bg-emerald-50 border-emerald-500'
                        : showCorrectAnswer && answer === 'benar' && question.jawaban_benar !== 'benar'
                            ? 'bg-rose-50 border-rose-500'
                            : 'hover:bg-muted'
                        }`}
                >
                    <RadioGroupItem value="benar" id="option-benar" />
                    <Label htmlFor="option-benar" className="flex-1 cursor-pointer font-normal text-base">
                        Benar
                    </Label>
                </div>
                <div
                    className={`flex items-center space-x-3 p-3 rounded-sm border transition-colors ${showCorrectAnswer && question.jawaban_benar === 'salah'
                        ? 'bg-emerald-50 border-emerald-500'
                        : showCorrectAnswer && answer === 'salah' && question.jawaban_benar !== 'salah'
                            ? 'bg-rose-50 border-rose-500'
                            : 'hover:bg-muted'
                        }`}
                >
                    <RadioGroupItem value="salah" id="option-salah" />
                    <Label htmlFor="option-salah" className="flex-1 cursor-pointer font-normal text-base">
                        Salah
                    </Label>
                </div>
            </RadioGroup>
        );
    };

    const renderIsianSingkat = () => {
        return (
            <Input
                value={answer as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={disabled}
                placeholder="Ketik jawaban Anda..."
                className={
                    showCorrectAnswer
                        ? answer === question.jawaban_benar
                            ? 'border-emerald-500'
                            : 'border-rose-500'
                        : ''
                }
            />
        );
    };

    const renderEsai = () => {
        return (
            <Textarea
                value={answer as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={disabled}
                placeholder="Tulis jawaban Anda di sini..."
                rows={6}
                className="resize-none"
            />
        );
    };

    return (
        <Card className="rounded-sm shadow-sm">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-lg font-medium whitespace-pre-wrap">{question.pertanyaan}</p>
                    </div>
                    <div className="text-sm text-muted-foreground shrink-0">
                        {question.poin} poin
                    </div>
                </div>

                <div className="mt-4">
                    {question.tipe === 'pilihan_ganda' && renderPilihanGanda()}
                    {question.tipe === 'pilihan_ganda_multiple' && renderPilihanGandaMultiple()}
                    {question.tipe === 'benar_salah' && renderBenarSalah()}
                    {question.tipe === 'isian_singkat' && renderIsianSingkat()}
                    {question.tipe === 'esai' && renderEsai()}
                </div>

                {showCorrectAnswer && question.penjelasan && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Penjelasan:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                            {question.penjelasan}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
