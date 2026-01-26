import { forwardRef } from "react";
import { Input } from "./input";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/pustaka/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
}

/**
 * Reusable search input component with clear button and loading state
 *
 * @example
 * <SearchInput
 *   value={searchQuery}
 *   onChange={(_e) => setSearchQuery(e.target.value)}
 *   onClear={() => setSearchQuery("")}
 *   placeholder="Search submissions..."
 *   isLoading={isSearching}
 * />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, isLoading, value, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && onClear) {
        onClear();
      }
      props.onKeyDown?.(e);
    };

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          value={value}
          className={cn("pl-9 pr-9", className)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
