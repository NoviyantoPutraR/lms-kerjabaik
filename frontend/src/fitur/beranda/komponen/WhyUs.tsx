import React from 'react';
import { IMAGES } from '../constants';
import { ScrollReveal } from './ScrollReveal';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, delay = 0 }) => (
  <ScrollReveal direction="left" delay={delay}>
    <div className="flex gap-5 group">
      <div className="flex-shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-landing/10 text-primary-landing transition-all duration-300 group-hover:bg-primary-landing group-hover:text-white group-hover:scale-110">
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary-landing transition-colors font-lexend">{title}</h3>
        <p className="mt-2 text-text-sub dark:text-slate-400 leading-relaxed text-sm md:text-base font-lexend">{description}</p>
      </div>
    </div>
  </ScrollReveal>
);

export const WhyUs: React.FC = () => {
  return (
    <section className="py-24 bg-surface-light dark:bg-surface-dark border-y border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <ScrollReveal direction="right" className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div 
                  className="h-56 w-full rounded-2xl bg-slate-100 bg-cover bg-center shadow-lg dark:bg-slate-800 transform hover:rotate-2 transition-transform duration-500 border border-slate-100 dark:border-slate-800" 
                  style={{ backgroundImage: `url('${IMAGES.whyUs[0]}')` }}
                ></div>
                <div 
                  className="h-72 w-full rounded-2xl bg-slate-100 bg-cover bg-center shadow-lg dark:bg-slate-800 transform hover:-rotate-1 transition-transform duration-500 border border-slate-100 dark:border-slate-800" 
                  style={{ backgroundImage: `url('${IMAGES.whyUs[1]}')` }}
                ></div>
              </div>
              <div className="space-y-6">
                <div 
                  className="h-72 w-full rounded-2xl bg-slate-100 bg-cover bg-center shadow-lg dark:bg-slate-800 transform hover:-rotate-2 transition-transform duration-500 border border-slate-100 dark:border-slate-800" 
                  style={{ backgroundImage: `url('${IMAGES.whyUs[2]}')` }}
                ></div>
                <div 
                  className="h-56 w-full rounded-2xl bg-slate-100 bg-cover bg-center shadow-lg dark:bg-slate-800 transform hover:rotate-1 transition-transform duration-500 border border-slate-100 dark:border-slate-800" 
                  style={{ backgroundImage: `url('${IMAGES.whyUs[3]}')` }}
                ></div>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-3xl bg-primary-landing p-6 shadow-2xl shadow-primary-landing/40 animate-bounce-subtle">
              <span className="material-symbols-outlined text-[48px] text-white">workspace_premium</span>
            </div>
          </ScrollReveal>
          
          <div className="order-1 lg:order-2">
            <ScrollReveal direction="left" delay={100}>
              <h2 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white mb-6 font-lexend">Mengapa Profesional Memilih Kerjabaik Academy?</h2>
              <p className="text-lg text-text-sub dark:text-slate-400 mb-12 font-lexend">Kami fokus pada hasil nyata. Kurikulum kami disusun berdasarkan kebutuhan pasar kerja global saat ini.</p>
            </ScrollReveal>
            
            <div className="grid gap-8">
              <FeatureItem 
                icon="verified"
                title="Sertifikat Digital Terverifikasi"
                description="Dapatkan kredensial yang diakui oleh perusahaan global terkemuka. Tambahkan ke profil LinkedIn Anda hanya dengan satu klik."
                delay={200}
              />
              <FeatureItem 
                icon="psychology"
                title="Sistem Kuis Berbasis AI"
                description="AI canggih kami membantu pembuatan penilaian berkualitas tinggi secara otomatis di balik layar untuk memastikan pengukuran pembelajaran yang efektif."
                delay={300}
              />
              <FeatureItem 
                icon="co_present"
                title="Mentoring Eksklusif 1-on-1"
                description="Jangan belajar sendirian. Dapatkan bimbingan personal, tinjauan portofolio, dan nasihat karier langsung dari praktisi industri berpengalaman."
                delay={400}
              />
              <FeatureItem 
                icon="rocket_launch"
                title="Akselerasi Karier"
                description="Akses bursa kerja eksklusif kami dan dapatkan referensi prioritas ke mitra perekrutan kami setelah menyelesaikan kursus."
                delay={500}
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translate(-50%, -55%); }
          50% { transform: translate(-50%, -45%); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
