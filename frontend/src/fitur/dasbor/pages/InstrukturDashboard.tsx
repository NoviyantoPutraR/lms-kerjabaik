export function InstrukturDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Instruktur
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Kelola kursus dan pembelajar Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Kursus Saya
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            -
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Pembelajar
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            -
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tugas Pending
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            -
          </p>
        </div>
      </div>
    </div>
  );
}
