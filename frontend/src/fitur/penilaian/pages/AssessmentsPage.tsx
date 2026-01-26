export function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Asesmen & Kuis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola asesmen dan evaluasi pembelajaran
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Buat Asesmen Baru
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Daftar asesmen akan ditampilkan di sini
        </p>
      </div>
    </div>
  );
}
