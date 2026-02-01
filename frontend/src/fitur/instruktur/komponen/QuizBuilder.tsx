import { useState, useEffect } from "react";
import { pemberitahuan } from "@/pustaka/pemberitahuan";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import { Label } from "@/komponen/ui/label";
import { Textarea } from "@/komponen/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
} from "lucide-react";
import {
  useAssessmentQuestions,
  useSaveQuestions,
} from "../hooks/useAssessments";
import type { QuestionType, SaveQuestionData } from "../tipe/instructor.types";
import { Skeleton } from "@/komponen/ui/skeleton";

interface QuizBuilderProps {
  assessmentId: string;
  onSaveSuccess?: () => void;
}

export function QuizBuilder({ assessmentId, onSaveSuccess }: QuizBuilderProps) {
  const { data: existingQuestions, isLoading } =
    useAssessmentQuestions(assessmentId);
  const saveMutation = useSaveQuestions();

  const [questions, setQuestions] = useState<SaveQuestionData[]>([]);

  useEffect(() => {
    if (existingQuestions) {
      setQuestions(
        existingQuestions.map((q) => ({
          id: q.id,
          pertanyaan: q.pertanyaan,
          tipe: q.tipe,
          opsi: q.opsi || { choices: ["", "", "", ""] },
          jawaban_benar: q.jawaban_benar || "",
          poin: q.poin,
          penjelasan: q.penjelasan || "",
          urutan: q.urutan,
        })),
      );
    }
  }, [existingQuestions]);

  const addQuestion = () => {
    const newQuestion: SaveQuestionData = {
      pertanyaan: "",
      tipe: "pilihan_ganda",
      opsi: { choices: ["", "", "", ""] },
      jawaban_benar: "0", // Index of correct choice
      poin: 10,
      penjelasan: "",
      urutan: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Update urutan
    setQuestions(newQuestions.map((q, i) => ({ ...q, urutan: i })));
  };

  const updateQuestion = (index: number, data: Partial<SaveQuestionData>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...data };
    setQuestions(newQuestions);
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[newIndex];
    newQuestions[newIndex] = temp;

    // Update urutan
    setQuestions(newQuestions.map((q, i) => ({ ...q, urutan: i })));
  };

  const handleSave = () => {
    pemberitahuan.tampilkanPemuatan("Menyimpan pertanyaan...");
    saveMutation.mutate(
      { assessmentId, questions },
      {
        onSuccess: () => {
          pemberitahuan.hilangkanPemuatan();
          pemberitahuan.sukses("Pertanyaan berhasil disimpan");
          if (onSaveSuccess) onSaveSuccess();
        },
        onError: (error: any) => {
          pemberitahuan.hilangkanPemuatan();
          pemberitahuan.gagal(error.message || "Gagal menyimpan pertanyaan");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3 mb-2">
        <h3 className="text-base font-semibold">
          Daftar Pertanyaan <span className="text-muted-foreground font-normal text-sm">({questions.length} butir)</span>
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addQuestion} className="h-8 text-xs">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Tambah
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending || questions.length === 0}
            className="h-8 text-xs"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saveMutation.isPending ? "Menyimpan..." : "Simpan Semua"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                Belum ada pertanyaan.
              </p>
              <Button size="sm" onClick={addQuestion} className="h-8 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Mulai Buat Soal
              </Button>
            </CardContent>
          </Card>
        ) : (
          questions.map((q, qIndex) => (
            <Card key={qIndex} className="relative overflow-hidden group border-border/60 shadow-sm">
              <CardHeader className="py-2.5 px-4 bg-muted/30 border-b flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground/80">
                  <div className="bg-background border rounded px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                    #{qIndex + 1}
                  </div>
                  <span className="truncate max-w-[300px]">{q.pertanyaan || "Pertanyaan Baru"}</span>
                </CardTitle>
                <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveQuestion(qIndex, "up")}
                    disabled={qIndex === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveQuestion(qIndex, "down")}
                    disabled={qIndex === questions.length - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <div className="w-px h-3 bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Top Row: Question + Config */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Teks Pertanyaan</Label>
                    <Textarea
                      placeholder="Tulis pertanyaan di sini..."
                      value={q.pertanyaan}
                      onChange={(e) =>
                        updateQuestion(qIndex, { pertanyaan: e.target.value })
                      }
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </div>
                  <div className="w-[180px] space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Tipe Soal</Label>
                      <Select
                        value={q.tipe}
                        onValueChange={(val) =>
                          updateQuestion(qIndex, { tipe: val as QuestionType })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pilihan_ganda">Pilihan Ganda</SelectItem>
                          <SelectItem value="benar_salah">Benar/Salah</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Poin</Label>
                      <Input
                        type="number"
                        min="0"
                        value={q.poin}
                        onChange={(e) =>
                          updateQuestion(qIndex, {
                            poin: parseInt(e.target.value),
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Answer Area */}
                <div className="bg-muted/30 rounded-md p-3 border border-border/50">
                  {q.tipe === "pilihan_ganda" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                         <Label className="text-xs font-medium text-muted-foreground">Opsi Jawaban & Kunci (Pilih Radio)</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {q.opsi.choices.map((choice: string, cIndex: number) => (
                          <div key={cIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={String(q.jawaban_benar) === String(cIndex)}
                              onChange={() =>
                                updateQuestion(qIndex, {
                                  jawaban_benar: String(cIndex),
                                })
                              }
                              className="h-3.5 w-3.5 text-primary cursor-pointer accent-primary"
                            />
                            <Input
                              placeholder={`Pilihan ${String.fromCharCode(65 + cIndex)}`}
                              value={choice}
                              onChange={(e) => {
                                const newChoices = [...q.opsi.choices];
                                newChoices[cIndex] = e.target.value;
                                updateQuestion(qIndex, {
                                  opsi: { ...q.opsi, choices: newChoices },
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.tipe === "benar_salah" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Kunci Jawaban</Label>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent/50 transition-colors">
                          <input
                            type="radio"
                            id={`q${qIndex}-true`}
                            name={`correct-${qIndex}`}
                            checked={q.jawaban_benar === "true"}
                            onChange={() =>
                              updateQuestion(qIndex, { jawaban_benar: "true" })
                            }
                            className="h-3.5 w-3.5 text-primary accent-primary cursor-pointer"
                          />
                          <Label htmlFor={`q${qIndex}-true`} className="text-xs cursor-pointer">BENAR</Label>
                        </div>
                        <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent/50 transition-colors">
                          <input
                            type="radio"
                            id={`q${qIndex}-false`}
                            name={`correct-${qIndex}`}
                            checked={q.jawaban_benar === "false"}
                            onChange={() =>
                              updateQuestion(qIndex, { jawaban_benar: "false" })
                            }
                            className="h-3.5 w-3.5 text-primary accent-primary cursor-pointer"
                          />
                          <Label htmlFor={`q${qIndex}-false`} className="text-xs cursor-pointer">SALAH</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Explanation Field */}
                  <div className="pt-2 mt-2 border-t border-border/50">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Penjelasan (Opsional)
                      </Label>
                      <Textarea
                        placeholder="Jelaskan kenapa jawaban ini benar..."
                        value={q.penjelasan || ""}
                        onChange={(e) =>
                          updateQuestion(qIndex, { penjelasan: e.target.value })
                        }
                        rows={1}
                        className="min-h-[40px] text-xs resize-none bg-background/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {questions.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="h-8 text-xs px-6">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saveMutation.isPending
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </Button>
        </div>
      )}
    </div>
  );
}
