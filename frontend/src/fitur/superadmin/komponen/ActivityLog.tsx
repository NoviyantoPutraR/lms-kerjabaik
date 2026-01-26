import { formatTanggal } from "@/pustaka/utils";
import type { AuditLogWithUser } from "../tipe/auditLog.types";
import { Badge } from "@/komponen/ui/badge";

interface ActivityLogProps {
  logs: AuditLogWithUser[];
  isLoading?: boolean;
}

const actionColors: Record<string, string> = {
  CREATE:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  LOGIN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  LOGOUT: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  IMPERSONATE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
};

export function ActivityLog({ logs, isLoading }: ActivityLogProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse"
          >
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mt-2" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Tidak ada aktivitas yang tercatat
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={actionColors[log.aksi] || actionColors.UPDATE}
              >
                {log.aksi === 'CREATE' ? 'Buat' :
                  log.aksi === 'UPDATE' ? 'Perbarui' :
                    log.aksi === 'DELETE' ? 'Hapus' :
                      log.aksi === 'LOGIN' ? 'Masuk' :
                        log.aksi === 'LOGOUT' ? 'Keluar' :
                          log.aksi === 'IMPERSONATE' ? 'Login Sebagai' : log.aksi}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {log.tipe_sumber_daya}
              </span>
              {log.nama_pengguna && (
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  oleh {log.nama_pengguna}
                </span>
              )}
            </div>
            {log.nama_lembaga && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Lembaga: {log.nama_lembaga}
              </p>
            )}
            {log.detail && Object.keys(log.detail).length > 0 && (
              <details className="mt-2">
                <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Lihat detail
                </summary>
                <pre className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                  {JSON.stringify(log.detail, null, 2)}
                </pre>
              </details>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {formatTanggal(log.created_at, "long")} •{" "}
              {new Date(log.created_at).toLocaleTimeString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
