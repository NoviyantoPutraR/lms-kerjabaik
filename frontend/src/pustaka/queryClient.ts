import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance
 * Exported untuk digunakan di authStore untuk clear cache saat logout
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (reduced from 10s to prevent rapid refetch loops on tab switch)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
