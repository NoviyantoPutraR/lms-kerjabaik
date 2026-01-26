import { useState } from "react";
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
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/komponen/ui/alert";
import type { BulkImportResult } from "../tipe/admin.types";

interface DialogImporMassalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
  isImporting?: boolean;
  importResult?: BulkImportResult | null;
}

export function DialogImporMassal({
  open,
  onOpenChange,
  onImport,
  isImporting,
  importResult,
}: DialogImporMassalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const template =
      "nama_lengkap,email,password,role\nJohn Doe,john@example.com,password123,pembelajar\nJane Smith,jane@example.com,password456,instruktur";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-import-users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Users</DialogTitle>
          <DialogDescription>
            Import multiple users sekaligus menggunakan file CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div>
            <Label>Download Template CSV</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4 mr-2" />
              Download template-import-users.csv
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              Template berisi format: nama_lengkap, email, password, role
            </p>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <div className="mt-2">
              <label
                htmlFor="csv-file"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <div className="text-center">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click untuk upload file CSV
                      </p>
                    </>
                  )}
                </div>
              </label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {/* Import Result */}
          {importResult && (
            <div className="space-y-2">
              <Alert>
                <CheckCircle2 className="w-4 h-4" />
                <AlertDescription>
                  <span className="font-semibold text-green-600">
                    {importResult.success} user berhasil diimport
                  </span>
                  {importResult.failed > 0 && (
                    <span className="ml-2 text-red-600">
                      ({importResult.failed} gagal)
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {importResult.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-red-50 dark:bg-red-900/10">
                  <p className="text-sm font-semibold mb-2">Errors:</p>
                  {importResult.errors.map((error, idx) => (
                    <div key={idx} className="text-xs text-red-600 mb-1">
                      Row {error.row} ({error.email}): {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <strong>Format CSV:</strong> nama_lengkap, email, password, role
              <br />
              <strong>Role yang valid:</strong> admin, instruktur, pembelajar
              <br />
              <strong>Catatan:</strong> Baris pertama (header) akan di-skip
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isImporting}
          >
            {importResult ? "Tutup" : "Batal"}
          </Button>
          {!importResult && (
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? "Importing..." : "Import Users"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
