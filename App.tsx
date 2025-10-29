import React, { useState, useEffect, useCallback } from 'react';
import { CalculationResult } from './types';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import { Sun, Moon, Calendar, Gift } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleCalculate = (newResult: CalculationResult) => {
    setResult(newResult);
  };
  
  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 transition-colors duration-300 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Gift className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              ChronoCraft
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your Personal Time Weaver
          </p>
           <h2 className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-semibold mt-2">
            Age Calculator
          </h2>
        </header>

        <div className="w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 transition-shadow duration-300">
            <CalculatorForm onCalculate={handleCalculate} onClear={handleClear} hasResult={!!result} />
          </div>
          
          {result && <ResultsDisplay result={result} />}
        </div>
        
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ChronoCraft. Crafted with precision and care.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;