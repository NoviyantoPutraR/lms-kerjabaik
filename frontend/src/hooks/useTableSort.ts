import { useState, useEffect, useCallback } from "react";

export type SortDirection = "asc" | "desc";

export interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface UseTableSortOptions {
  storageKey?: string;
  defaultSort?: {
    key: string;
    direction: SortDirection;
  };
}

/**
 * Custom hook for table sorting with localStorage persistence
 *
 * @example
 * const { sortConfig, sortedData, handleSort } = useTableSort(data, {
 *   storageKey: 'submissions-sort',
 *   defaultSort: { key: 'submitted_at', direction: 'asc' }
 * });
 */
export function useTableSort<T extends Record<string, any>>(
  data: T[],
  options: UseTableSortOptions = {},
) {
  const { storageKey, defaultSort } = options;

  // Initialize sort config from localStorage or default
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Ignore parse errors
        }
      }
    }
    return {
      key: (defaultSort?.key as keyof T) || null,
      direction: defaultSort?.direction || "asc",
    };
  });

  // Save to localStorage when sort config changes
  useEffect(() => {
    if (storageKey && sortConfig.key) {
      localStorage.setItem(storageKey, JSON.stringify(sortConfig));
    }
  }, [sortConfig, storageKey]);

  // Handle sort column click
  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((current) => {
      if (current.key === key) {
        // Toggle direction if same column
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      // New column, default to ascending
      return {
        key,
        direction: "asc",
      };
    });
  }, []);

  // Sort data
  const sortedData = useCallback(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (
        aValue &&
        bValue &&
        typeof aValue === "object" &&
        typeof bValue === "object" &&
        "getTime" in aValue &&
        "getTime" in bValue
      ) {
        // Date comparison
        comparison = (aValue as Date).getTime() - (bValue as Date).getTime();
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  return {
    sortConfig,
    sortedData: sortedData(),
    handleSort,
    setSortConfig,
  };
}
