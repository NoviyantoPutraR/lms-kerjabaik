import React, { useState, useEffect } from 'react';
import { Header } from '../komponen/Header';
import { Hero } from '../komponen/Hero';
import { Methodology } from '../komponen/Methodology';
import { Courses } from '../komponen/Courses';
import { WhyUs } from '../komponen/WhyUs';
import { Footer } from '../komponen/Footer';

export const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sync with existing theme if any, or use local state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased min-h-screen transition-colors duration-300 overflow-x-hidden">
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main>
        <Hero />
        <Methodology />
        <Courses />
        <WhyUs />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
