import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-background-dark dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-landing text-white">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <span className="text-lg font-black text-text-main dark:text-white font-lexend">Kerjabaik Academy</span>
            </div>
            <p className="max-w-xs text-center md:text-left text-xs text-text-sub dark:text-slate-500 font-lexend">
              Platform pengembangan karier profesional terbaik untuk masa depan gemilang Anda.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8">
              <a className="text-xs font-semibold text-text-sub hover:text-primary-landing dark:text-slate-400 dark:hover:text-white transition-colors font-lexend" href="#">Kebijakan Privasi</a>
              <a className="text-xs font-semibold text-text-sub hover:text-primary-landing dark:text-slate-400 dark:hover:text-white transition-colors font-lexend" href="#">Ketentuan Layanan</a>
            </div>
            <p className="text-xs font-medium text-text-sub dark:text-slate-500 font-lexend">
              © 2024 Kerjabaik Academy. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
