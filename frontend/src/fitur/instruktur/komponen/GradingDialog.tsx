import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/komponen/ui/dialog";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import { Label } from "@/komponen/ui/label";
import { Textarea } from "@/komponen/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import { Avatar, AvatarFallback } from "@/komponen/ui/avatar";
import { FileText, Download, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useSubmissionDetail } from "../hooks/useAssessments";
import { useGradeSubmission } from "../hooks/useAssessments";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

interface GradingDialogProps {
  submissionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GradingDialog({
  submissionId,
  open,
  onOpenChange,
}: GradingDialogProps) {
  const { data: submission, isLoading } = useSubmissionDetail(submissionId);
  const gradeSubmissionMutation = useGradeSubmission();

  const [grade, setGrade] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [status, setStatus] = useState<
    "graded" | "rejected" | "revision_requested"
  >("graded");

  // Initialize form when submission loads
  useEffect(() => {
    if (submission) {
      setGrade(submission.grade?.toString() || "");
      setFeedback(submission.feedback || "");
      if (submission.status !== "pending") {
        setStatus(submission.status as any);
      }
    }
  }, [submission]);

  const handleSubmit = async () => {
    if (!submission) return;

    const gradeValue = parseFloat(grade);


    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast.error(`Nilai harus antara 0-100`, {
        description: "Masukkan nilai yang valid untuk melanjutkan"
      });
      return;
    }

    await gradeSubmissionMutation.mutateAsync({
      submissionId,
      gradeData: {
        grade: gradeValue,
        feedback: feedback.trim() || undefined,
        status,
      },
    });

    toast.success("Nilai berhasil disimpan", {
      description: `${submission.student_name} - ${gradeValue}/100`
    });

    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Penilaian Tugas/Ujian</DialogTitle>
          <DialogDescription>
            Berikan nilai dan umpan balik untuk hasil kerja peserta
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : submission ? (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {getInitials(submission.student_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{submission.student_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {submission.student_email}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Dikumpulkan{" "}
                    {formatDistanceToNow(new Date(submission.submitted_at), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </span>
                  <Badge
                    variant={
                      submission.status === "pending"
                        ? "secondary"
                        : submission.status === "graded"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {submission.status === "pending" ? "Menunggu" :
                      submission.status === "graded" ? "Dinilai" :
                        submission.status === "rejected" ? "Ditolak" : "Revisi"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="space-y-2">
              <div>
                <Label className="text-base font-semibold">Kursus</Label>
                <p className="text-sm text-muted-foreground">
                  {submission.kursus_judul}
                </p>
              </div>
              <h4 className="font-medium">{submission.assignment_title}</h4>
              {submission.assignment_description && (
                <p className="text-sm text-muted-foreground">
                  {submission.assignment_description}
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium">Nilai Minimal Lulus:</span>{" "}
                {submission.assignment_max_score}
              </p>
            </div>

            {/* Submission Content */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Konten Hasil Kerja
              </Label>

              {submission.url_berkas && (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Berkas Unggahan</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.url_berkas?.split("/").pop() || "berkas"}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={submission.url_berkas}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Unduh Berkas
                    </a>
                  </Button>
                </div>
              )}

              {submission.text_content && (
                <div className="rounded-lg border p-4">
                  <p className="whitespace-pre-wrap text-sm">
                    {submission.text_content}
                  </p>
                </div>
              )}
            </div>

            {/* Grading Form */}
            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
              <h4 className="font-semibold">Penilaian</h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="grade">
                    Nilai (0-100)
                  </Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Masukkan nilai"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: any) => setStatus(value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="graded">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Graded
                        </div>
                      </SelectItem>
                      <SelectItem value="revision_requested">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Request Revision
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Opsional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Berikan feedback untuk peserta..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Submission tidak ditemukan
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={gradeSubmissionMutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!submission || gradeSubmissionMutation.isPending}
          >
            {gradeSubmissionMutation.isPending
              ? "Menyimpan..."
              : "Simpan Nilai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
