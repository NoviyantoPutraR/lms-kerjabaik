import { Button } from "@/komponen/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/komponen/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { exportToCSV } from "../api/reportsApi";

interface TombolEksporLaporanProps {
  data: any[];
  filename: string;
  disabled?: boolean;
}

export function TombolEksporLaporan({
  data,
  filename,
  disabled = false,
}: TombolEksporLaporanProps) {
  const handleExportCSV = () => {
    if (data.length === 0) return;
    exportToCSV(data, filename);
  };

  const handleExportExcel = () => {
    if (data.length === 0) return;

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || data.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export ke CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export ke Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
