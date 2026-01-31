
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Methodology } from './components/Methodology';
import { Courses } from './components/Courses';
import { WhyUs } from './components/WhyUs';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased min-h-screen transition-colors duration-300">
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

export default App;
