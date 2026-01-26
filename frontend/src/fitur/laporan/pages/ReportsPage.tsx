export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Laporan & Analitik
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Pantau progress dan performa pembelajaran
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Laporan Progress
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Chart progress akan ditampilkan di sini
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Laporan Nilai
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Chart nilai akan ditampilkan di sini
          </p>
        </div>
      </div>
    </div>
  );
}
