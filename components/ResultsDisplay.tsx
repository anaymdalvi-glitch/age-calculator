import React, { useState, useEffect, useCallback } from 'react';
import { CalculationResult, Age, Countdown } from '../types';
import { FunFactsCard } from './FunFactsCard';
import { Clock, Gift, Star, PawPrint, CalendarDays, Copy, Check } from 'lucide-react';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [currentAge, setCurrentAge] = useState<Age>(result.age);
  const [countdown, setCountdown] = useState<Countdown>(result.nextBirthdayCountdown);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Update age
      let years = now.getFullYear() - result.birthDate.getFullYear();
      let months = now.getMonth() - result.birthDate.getMonth();
      let days = now.getDate() - result.birthDate.getDate();
      let hours = now.getHours() - result.birthDate.getHours();
      let minutes = now.getMinutes() - result.birthDate.getMinutes();
      let seconds = now.getSeconds() - result.birthDate.getSeconds();

      if (seconds < 0) { minutes--; seconds += 60; }
      if (minutes < 0) { hours--; minutes += 60; }
      if (hours < 0) { days--; hours += 24; }
      if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) { years--; months += 12; }
      setCurrentAge({ years, months, days, hours, minutes, seconds });
      
      // Update countdown
      const nextBirthday = new Date(now.getFullYear(), result.birthDate.getMonth(), result.birthDate.getDate());
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }
      const diff = nextBirthday.getTime() - now.getTime();
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result.birthDate]);

  const copyToClipboard = useCallback(() => {
    const textToCopy = `
My Age: ${currentAge.years} years, ${currentAge.months} months, ${currentAge.days} days
Next Birthday In: ${countdown.days} days
My Zodiac: ${result.zodiacSign} (Western), ${result.chineseZodiac} (Chinese)
Born on a: ${result.dayOfWeek}
Calculated with ChronoCraft!
    `.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  }, [currentAge, countdown, result]);

  return (
    <div className="mt-8 md:mt-12 animate-slide-up space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultCard icon={Clock} title="Your Precise Age" color="text-blue-500">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <TimeUnit value={currentAge.years} label="Years" />
                    <TimeUnit value={currentAge.months} label="Months" />
                    <TimeUnit value={currentAge.days} label="Days" />
                    <TimeUnit value={currentAge.hours} label="Hours" />
                    <TimeUnit value={currentAge.minutes} label="Minutes" />
                    <TimeUnit value={currentAge.seconds} label="Seconds" />
                </div>
            </ResultCard>
             <ResultCard icon={Gift} title="Next Birthday Countdown" color="text-pink-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <TimeUnit value={countdown.days} label="Days" />
                    <TimeUnit value={countdown.hours} label="Hours" />
                    <TimeUnit value={countdown.minutes} label="Minutes" />
                    <TimeUnit value={countdown.seconds} label="Seconds" />
                </div>
            </ResultCard>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoChip icon={Star} label="Zodiac Sign" value={result.zodiacSign} />
            <InfoChip icon={PawPrint} label="Chinese Zodiac" value={result.chineseZodiac} />
            <InfoChip icon={CalendarDays} label="Born on a" value={result.dayOfWeek} />
        </div>

        <FunFactsCard result={result} />

        <div className="text-center pt-4">
            <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl"
            >
                {isCopied ? <><Check className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Share My Age</>}
            </button>
        </div>
    </div>
  );
};

const ResultCard: React.FC<{icon: React.ElementType, title: string, color: string, children: React.ReactNode}> = ({icon: Icon, title, color, children}) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-6 h-6 ${color}`} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        {children}
    </div>
);

const TimeUnit: React.FC<{value: number, label: string}> = ({value, label}) => (
    <div>
        <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

const InfoChip: React.FC<{icon: React.ElementType, label: string, value: string}> = ({icon: Icon, label, value}) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow">
            <Icon className="w-6 h-6 text-purple-500" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{value}</p>
        </div>
    </div>
);