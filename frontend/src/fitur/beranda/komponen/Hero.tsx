import React from 'react';
import { IMAGES } from '../constants';
import { ScrollReveal } from './ScrollReveal';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col items-start gap-8">
            <ScrollReveal direction="right" delay={100}>
              <div className="inline-flex items-center rounded-full border border-primary-landing/20 bg-primary-landing/5 px-4 py-1.5 text-xs font-bold text-primary-landing tracking-wide uppercase">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary-landing animate-pulse"></span>
                Kursus Terbaru Tersedia
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={300}>
              <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-white sm:text-4xl lg:text-5xl lg:leading-[1.1] font-lexend">
                Tingkatkan Karier Anda bersama <span className="text-primary-landing">Kerjabaik Academy</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={500}>
              <p className="max-w-lg text-sm lg:text-base text-text-sub dark:text-slate-400 leading-relaxed font-lexend">
                Kuasai keterampilan yang paling dicari oleh pemberi kerja saat ini. Kursus fleksibel yang dipandu oleh ahli untuk akselerasi profesional Anda.
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={700}>
              <div className="flex flex-col w-full sm:flex-row gap-4 sm:w-auto">
                <Link to="/login" className="flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-primary-landing px-8 text-sm font-bold text-white shadow-xl shadow-primary-landing/25 transition-all hover:bg-primary-landing/90 hover:scale-105 active:scale-95 font-lexend">
                  Mulai Belajar Sekarang
                </Link>
                <Link to="/login" className="flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-white border border-slate-200 px-8 text-sm font-bold text-text-main shadow-sm transition-all hover:bg-slate-50 dark:bg-surface-dark dark:border-slate-700 dark:text-white dark:hover:bg-slate-800 font-lexend">
                  Lihat Katalog
                </Link>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={900}>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-sub dark:text-slate-400 font-lexend">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-green-500">verified_user</span>
                  <span>Instruktur Tersertifikasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-green-500">rocket_launch</span>
                  <span>Dukungan Karier</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          <ScrollReveal direction="left" delay={400} className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
              <div 
                className="h-full w-full bg-cover bg-center object-cover transform hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: `url('${IMAGES.hero}')` }}
              ></div>
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-3xl border-2 border-primary-landing/10"></div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
