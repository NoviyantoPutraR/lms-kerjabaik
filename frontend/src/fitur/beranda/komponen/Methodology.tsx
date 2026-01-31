import React from 'react';
import { ScrollReveal } from './ScrollReveal';

interface CardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const MethodCard: React.FC<CardProps> = ({ icon, title, description, delay = 0 }) => (
  <ScrollReveal direction="up" delay={delay}>
    <div className="flex flex-col items-center text-center p-6 transition-all duration-300 group hover:-translate-y-2">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-primary-landing transition-all duration-300 group-hover:bg-primary-landing group-hover:text-white dark:bg-slate-800 group-hover:shadow-lg group-hover:shadow-primary-landing/30">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mb-3 text-lg font-bold text-text-main dark:text-white font-lexend">{title}</h3>
      <p className="text-sm leading-relaxed text-text-sub dark:text-slate-400 font-lexend">{description}</p>
    </div>
  </ScrollReveal>
);

export const Methodology: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="none">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-primary-landing uppercase tracking-[0.2em] mb-3 font-lexend">Metodologi Belajar Kami</h2>
            <div className="h-1 w-12 bg-primary-landing mx-auto rounded-full"></div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          <MethodCard 
            icon="menu_book"
            title="Kurikulum Berbasis Industri"
            description="Materi yang dirancang oleh praktisi aktif untuk memastikan relevansi dengan kebutuhan pasar kerja terkini."
            delay={100}
          />
          <MethodCard 
            icon="terminal"
            title="Proyek Real-World"
            description="Belajar melalui studi kasus nyata untuk membangun portofolio yang mengesankan bagi para perekrut."
            delay={300}
          />
          <MethodCard 
            icon="groups"
            title="Komunitas Profesional"
            description="Akses jejaring eksklusif dengan sesama pembelajar dan mentor berpengalaman untuk tumbuh bersama."
            delay={500}
          />
        </div>
      </div>
    </section>
  );
};
