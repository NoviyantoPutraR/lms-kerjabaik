import { useState, useEffect, useRef } from "react";
import { Input } from "@/komponen/ui/input";
import { Button } from "@/komponen/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/pustaka/utils";

export interface InlineGradeInputProps {
  submissionId: string;
  currentGrade: number | null;
  maxScore: number;
  onSave: (submissionId: string, grade: number) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

/**
 * Inline grade input component for quick grading in table
 *
 * Features:
 * - Auto-focus on mount
 * - Enter to save, Esc to cancel
 * - Validation (0-maxScore)
 * - Loading state
 * - Error handling
 *
 * @example
 * <InlineGradeInput
 *   submissionId={submission.id}
 *   currentGrade={submission.grade}
 *   maxScore={100}
 *   onSave={handleQuickGrade}
 *   onCancel={() => setEditingId(null)}
 * />
 */
export function InlineGradeInput({
  submissionId,
  currentGrade,
  maxScore,
  onSave,
  onCancel,
  className,
}: InlineGradeInputProps) {
  const [value, setValue] = useState(currentGrade?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const validate = (val: string): boolean => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setError("Nilai harus berupa angka");
      return false;
    }
    if (num < 0 || num > maxScore) {
      setError(`Nilai harus antara 0-${maxScore}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate(value)) return;

    setIsLoading(true);
    try {
      await onSave(submissionId, parseFloat(value));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan nilai");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel?.();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="number"
          min="0"
          max={maxScore}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-20 h-8 text-sm",
            error && "border-destructive focus-visible:ring-destructive",
          )}
          disabled={isLoading}
          aria-label="Grade input"
          aria-invalid={!!error}
          aria-describedby={error ? "grade-error" : undefined}
        />
        {error && (
          <p
            id="grade-error"
            className="absolute top-full left-0 mt-1 text-xs text-destructive whitespace-nowrap"
          >
            {error}
          </p>
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={handleSave}
        disabled={isLoading || !!error}
        aria-label="Save grade"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={onCancel}
        disabled={isLoading}
        aria-label="Cancel"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
