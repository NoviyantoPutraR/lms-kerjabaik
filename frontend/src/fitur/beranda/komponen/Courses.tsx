import React from 'react';
import { Link } from 'react-router-dom';
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
  <ScrollReveal direction="up" delay={delay} className="h-full">
    <div className="group relative flex flex-col bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-landing/20 h-full">
      <div className="relative h-56 w-full overflow-hidden rounded-xl mb-6">
        <div 
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url('${image}')` }}
        ></div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary-landing shadow-sm backdrop-blur dark:bg-slate-900/90">
            {category}
          </span>
        </div>
      </div>
      <div className="px-2 pb-2 flex flex-col flex-1">
        <h3 className="mb-2 text-lg font-bold leading-tight text-text-main dark:text-white group-hover:text-primary-landing transition-colors font-lexend">
          {title}
        </h3>
        <p className="mb-4 text-xs lg:text-sm text-text-sub dark:text-slate-400 line-clamp-2 leading-relaxed font-lexend">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-full bg-slate-200 bg-cover bg-center border border-slate-100 shadow-sm" 
              style={{ backgroundImage: `url('${instructorAvatar}')` }}
            ></div>
            <span className="text-xs font-bold text-text-sub dark:text-slate-300 font-lexend">{instructorName}</span>
          </div>
          <span className={`text-base font-black font-lexend ${isFree ? 'text-green-600' : 'text-primary-landing'}`}>
            {price}
          </span>
        </div>
      </div>
    </div>
  </ScrollReveal>
);

export const Courses: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Data dummy yang diperluas untuk carousel
  const coursesData = [
    {
      image: IMAGES.courses.projectManagement,
      category: "Bisnis",
      title: "Manajemen Proyek Strategis",
      description: "Pahami cara memimpin proyek kompleks dan memberikan hasil yang selaras dengan tujuan organisasi.",
      instructorName: "David Chen",
      instructorAvatar: IMAGES.instructors.david,
      price: "Rp 499k",
      isFree: false
    },
    {
      image: IMAGES.courses.fullStack,
      category: "Teknologi",
      title: "Pengembangan Web Full-Stack",
      description: "Kuasai teknologi web modern termasuk React, Node.js, dan Infrastruktur Cloud dari dasar.",
      instructorName: "Sarah Miller",
      instructorAvatar: IMAGES.instructors.sarah,
      price: "Gratis",
      isFree: true
    },
    {
      image: IMAGES.courses.dataScience,
      category: "Data",
      title: "Data Science untuk Eksekutif",
      description: "Pahami analitik data, machine learning, dan AI untuk pengambilan keputusan strategis.",
      instructorName: "James Wilson",
      instructorAvatar: IMAGES.instructors.james,
      price: "Rp 750k",
      isFree: false
    },
    {
      image: IMAGES.courses.projectManagement,
      category: "Desain",
      title: "UI/UX Design Masterclass",
      description: "Pelajari prinsip desain antarmuka modern dan pengalaman pengguna yang memikat dari nol.",
      instructorName: "Anna Lee",
      instructorAvatar: IMAGES.instructors.sarah,
      price: "Rp 350k",
      isFree: false
    },
    {
      image: IMAGES.courses.fullStack,
      category: "Marketing",
      title: "Digital Marketing Strategy",
      description: "Kuasai strategi pemasaran digital, SEO, dan social media ads untuk pertumbuhan bisnis.",
      instructorName: "Michael Brown",
      instructorAvatar: IMAGES.instructors.david,
      price: "Rp 299k",
      isFree: false
    }
  ];

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // Desktop
      if (window.innerWidth >= 640) return 2;  // Tablet
      return 1; // Mobile
    }
    return 3;
  };

  const [itemsPerSlide, setItemsPerSlide] = React.useState(getItemsPerSlide());

  React.useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(coursesData.length / itemsPerSlide);
  const maxIndex = Math.max(0, coursesData.length - itemsPerSlide);

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto slide
  React.useEffect(() => {
    let interval: any;
    if (!isHovered) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 lg:px-16"
           onMouseEnter={() => setIsHovered(true)} 
           onMouseLeave={() => setIsHovered(false)}>
        
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <ScrollReveal direction="right" className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-text-main dark:text-white font-lexend">Kursus Profesional Populer</h2>
            <p className="mt-3 text-sm text-text-sub dark:text-slate-400 font-lexend">Jelajahi kurikulum terbaik yang dirancang khusus untuk membantu kemajuan karier Anda di industri modern.</p>
          </ScrollReveal>
          
          {/* Navigation Arrows (Header Position) */}
          <div className="hidden sm:flex gap-3">
            <button 
              onClick={prevSlide}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-text-main shadow-sm transition-all hover:border-primary-landing hover:bg-primary-landing hover:text-white dark:border-slate-700 dark:bg-surface-dark dark:text-white dark:hover:border-primary-landing dark:hover:bg-primary-landing"
              aria-label="Previous slide"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>
            <button 
              onClick={nextSlide}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-text-main shadow-sm transition-all hover:border-primary-landing hover:bg-primary-landing hover:text-white dark:border-slate-700 dark:bg-surface-dark dark:text-white dark:hover:border-primary-landing dark:hover:bg-primary-landing"
              aria-label="Next slide"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden py-12 px-4 -my-12 -mx-4">
            <div 
              className="flex transition-transform duration-500 ease-in-out items-stretch"
              style={{ transform: `translateX(-${activeIndex * (100 / itemsPerSlide)}%)` }}
            >
              {coursesData.map((course, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-3 transition-all duration-300 h-full"
                  style={{ width: `${100 / itemsPerSlide}%` }}
                >
                  <CourseCard {...course} delay={0} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Arrows (Overlay) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0 sm:hidden pointer-events-none">
            <button 
              onClick={prevSlide}
              className="pointer-events-auto -ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm text-text-main border border-slate-100 dark:bg-slate-800/90 dark:text-white dark:border-slate-700"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={nextSlide}
              className="pointer-events-auto -mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm text-text-main border border-slate-100 dark:bg-slate-800/90 dark:text-white dark:border-slate-700"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link className="group flex items-center font-bold text-primary-landing transition-all hover:gap-2 font-lexend text-sm" to="/login">
            Lihat Semua Kursus
            <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
