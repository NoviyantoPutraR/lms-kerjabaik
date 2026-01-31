
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-background-dark dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <span className="text-xl font-black text-text-main dark:text-white">Kerjabaik Academy</span>
            </div>
            <p className="max-w-xs text-center md:text-left text-sm text-text-sub dark:text-slate-500">
              Platform pengembangan karier profesional terbaik untuk masa depan gemilang Anda.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8">
              <a className="text-sm font-semibold text-text-sub hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Kebijakan Privasi</a>
              <a className="text-sm font-semibold text-text-sub hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Ketentuan Layanan</a>
            </div>
            <p className="text-sm font-medium text-text-sub dark:text-slate-500">
              © 2024 Kerjabaik Academy. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
