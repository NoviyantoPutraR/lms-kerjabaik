import { TableHead } from "./table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/pustaka/utils";
import type { SortDirection } from "@/hooks/useTableSort";

export interface SortableTableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSortKey: string | null;
  currentDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
  align?: "left" | "center" | "right";
}

/**
 * Reusable sortable table header component
 *
 * @example
 * <SortableTableHeader
 *   sortKey="student_name"
 *   currentSortKey={sortConfig.key}
 *   currentDirection={sortConfig.direction}
 *   onSort={handleSort}
 * >
 *   Peserta
 * </SortableTableHeader>
 */
export function SortableTableHeader({
  children,
  sortKey,
  currentSortKey,
  currentDirection,
  onSort,
  className,
  align = "left",
}: SortableTableHeaderProps) {
  const isActive = currentSortKey === sortKey;
  const Icon = isActive
    ? currentDirection === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50 transition-colors",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      onClick={() => onSort(sortKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSort(sortKey);
        }
      }}
      aria-sort={
        isActive
          ? currentDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        <Icon
          className={cn(
            "h-4 w-4 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
          )}
        />
      </div>
    </TableHead>
  );
}
