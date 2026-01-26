import { useState } from "react";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import { Label } from "@/komponen/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import { Calendar } from "@/komponen/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/komponen/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/pustaka/utils";
import type { ReportFilters } from "../api/reportsApi";

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  showCourseFilter?: boolean;
  showStatusFilter?: boolean;
  showKategoriFilter?: boolean;
}

export function FilterLaporan({
  filters,
  onFiltersChange,
  showStatusFilter = true,
  showKategoriFilter = true,
}: ReportFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined,
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined,
  );

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFiltersChange({
      ...filters,
      dateFrom: date ? format(date, "yyyy-MM-dd") : undefined,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFiltersChange({
      ...filters,
      dateTo: date ? format(date, "yyyy-MM-dd") : undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value || undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : value,
    });
  };

  const handleKategoriChange = (value: string) => {
    onFiltersChange({
      ...filters,
      kategori: value === "all" ? undefined : value,
    });
  };

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.searchQuery ||
    filters.status ||
    filters.kategori;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filter Laporan</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Reset Filter
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="date-from" className="text-xs">
            Dari Tanggal
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-from"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? (
                  format(dateFrom, "dd MMM yyyy", { locale: localeId })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="date-to" className="text-xs">
            Sampai Tanggal
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-to"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? (
                  format(dateTo, "dd MMM yyyy", { locale: localeId })
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status Filter */}
        {showStatusFilter && (
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs">
              Status
            </Label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="dropped">Berhenti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Kategori Filter */}
        {showKategoriFilter && (
          <div className="space-y-2">
            <Label htmlFor="kategori" className="text-xs">
              Kategori
            </Label>
            <Select
              value={filters.kategori || "all"}
              onValueChange={handleKategoriChange}
            >
              <SelectTrigger id="kategori">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Teknologi">Teknologi</SelectItem>
                <SelectItem value="Bisnis">Bisnis</SelectItem>
                <SelectItem value="Desain">Desain</SelectItem>
                <SelectItem value="Bahasa">Bahasa</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search */}
        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <Label htmlFor="search" className="text-xs">
            Cari Peserta atau Kursus
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Ketik nama peserta, email, atau judul kursus..."
            value={filters.searchQuery || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
