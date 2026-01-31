import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-surface-light/90 backdrop-blur-md dark:bg-surface-dark/90 dark:border-slate-800 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-landing text-white">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-main dark:text-white font-lexend">
            Kerjabaik <span className="text-primary-landing font-black">Academy</span>
          </h2>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Kursus', 'Mentor', 'Perusahaan', 'Tentang Kami'].map((item) => (
            <a 
              key={item}
              className="text-sm font-semibold text-text-sub hover:text-primary-landing transition-colors dark:text-slate-300 dark:hover:text-primary-landing" 
              href="#"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-text-sub dark:text-slate-300"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <Link to="/login" className="hidden md:flex text-sm font-bold text-text-main hover:text-primary-landing transition-colors dark:text-white dark:hover:text-primary-landing">
            Masuk
          </Link>
          <Link to="/login" className="flex h-10 items-center justify-center rounded-full bg-primary-landing px-6 text-sm font-bold text-white shadow-lg shadow-primary-landing/20 transition-all hover:bg-primary-landing/90 hover:-translate-y-0.5">
            Daftar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
};
