
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200 shadow-md"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};
