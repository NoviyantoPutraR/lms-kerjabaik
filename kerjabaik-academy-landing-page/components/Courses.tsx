
import React from 'react';
import { IMAGES } from '../constants';
import { ScrollReveal } from './ScrollReveal';

interface CourseCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string;
  price: string;
  isFree?: boolean;
  delay?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  image, category, title, description, instructorName, instructorAvatar, price, isFree, delay = 0 
}) => (
  <ScrollReveal direction="up" delay={delay}>
    <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:border-primary/20 h-full">
      <div className="relative h-56 w-full overflow-hidden rounded-xl mb-6">
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url('${image}')` }}
        ></div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary shadow-sm backdrop-blur dark:bg-slate-900/90">
            {category}
          </span>
        </div>
      </div>
      <div className="px-2 pb-2 flex flex-col flex-1">
        <h3 className="mb-3 text-2xl font-bold leading-tight text-text-main dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-6 text-sm text-text-sub dark:text-slate-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-full bg-slate-200 bg-cover bg-center" 
              style={{ backgroundImage: `url('${instructorAvatar}')` }}
            ></div>
            <span className="text-xs font-bold text-text-sub dark:text-slate-300">{instructorName}</span>
          </div>
          <span className={`text-lg font-black ${isFree ? 'text-green-600' : 'text-primary'}`}>
            {price}
          </span>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export const Courses: React.FC = () => {
  return (
    <section className="py-24 bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <ScrollReveal direction="right" className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white">Kursus Profesional Populer</h2>
            <p className="mt-4 text-lg text-text-sub dark:text-slate-400">Jelajahi kurikulum terbaik yang dirancang khusus untuk membantu kemajuan karier Anda di industri modern.</p>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={200}>
            <a className="group flex items-center font-bold text-primary transition-all hover:gap-2" href="#">
              Lihat Semua Kursus
              <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
            </a>
          </ScrollReveal>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCard 
            image={IMAGES.courses.projectManagement}
            category="Bisnis"
            title="Manajemen Proyek Strategis"
            description="Pahami cara memimpin proyek kompleks dan memberikan hasil yang selaras dengan tujuan organisasi."
            instructorName="David Chen"
            instructorAvatar={IMAGES.instructors.david}
            price="Rp 499k"
            delay={100}
          />
          <CourseCard 
            image={IMAGES.courses.fullStack}
            category="Teknologi"
            title="Pengembangan Web Full-Stack"
            description="Kuasai teknologi web modern termasuk React, Node.js, dan Infrastruktur Cloud dari dasar."
            instructorName="Sarah Miller"
            instructorAvatar={IMAGES.instructors.sarah}
            price="Gratis"
            isFree
            delay={250}
          />
          <CourseCard 
            image={IMAGES.courses.dataScience}
            category="Data"
            title="Data Science untuk Eksekutif"
            description="Pahami analitik data, machine learning, dan AI untuk pengambilan keputusan strategis."
            instructorName="James Wilson"
            instructorAvatar={IMAGES.instructors.james}
            price="Rp 750k"
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};
