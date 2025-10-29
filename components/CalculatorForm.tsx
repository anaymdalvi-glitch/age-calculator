
import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { RotateCw, Sparkles } from 'lucide-react';

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult) => void;
  onClear: () => void;
  hasResult: boolean;
}

const initialDate = { day: '', month: '', year: '' };
const initialTime = { hour: '12', minute: '00', period: 'AM' };

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, onClear, hasResult }) => {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [showTime, setShowTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('birthData');
    if (savedData) {
      const { savedDate, savedTime, savedShowTime } = JSON.parse(savedData);
      setDate(savedDate);
      setTime(savedTime);
      setShowTime(savedShowTime);
      setSave(true);
    }
  }, []);

  const handleSaveToggle = () => {
    if (save) {
      localStorage.removeItem('birthData');
      setSave(false);
    } else {
      const dataToSave = { savedDate: date, savedTime: time, savedShowTime: showTime };
      localStorage.setItem('birthData', JSON.stringify(dataToSave));
      setSave(true);
    }
  };

  const calculateAge = () => {
    setError(null);
    const { day, month, year } = date;

    if (!day || !month || !year) {
      setError("Please fill in all date fields.");
      return;
    }

    const dayNum = parseInt(day), monthNum = parseInt(month), yearNum = parseInt(year);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      setError("Please enter valid numbers for the date.");
      return;
    }

    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900) {
      setError("Please enter a valid date (e.g., Year > 1900).");
      return;
    }

    let hour24 = parseInt(time.hour);
    if (time.period === 'PM' && hour24 !== 12) hour24 += 12;
    if (time.period === 'AM' && hour24 === 12) hour24 = 0;

    const birthDate = new Date(yearNum, monthNum - 1, dayNum, showTime ? hour24 : 0, showTime ? parseInt(time.minute) : 0);

    if (birthDate > new Date()) {
      setError("Birth date cannot be in the future.");
      return;
    }

    onCalculate(performCalculations(birthDate));

    if(save) {
      const dataToSave = { savedDate: date, savedTime: time, savedShowTime: showTime };
      localStorage.setItem('birthData', JSON.stringify(dataToSave));
    }
  };
  
  const handleClear = () => {
    setDate(initialDate);
    setTime(initialTime);
    setShowTime(false);
    setError(null);
    onClear();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input fields */}
        {createInputField('Day', 'DD', date.day, (e) => setDate({ ...date, day: e.target.value }), 'day')}
        {createInputField('Month', 'MM', date.month, (e) => setDate({ ...date, month: e.target.value }), 'month')}
        {createInputField('Year', 'YYYY', date.year, (e) => setDate({ ...date, year: e.target.value }), 'year')}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showTime"
          checked={showTime}
          onChange={() => setShowTime(!showTime)}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="showTime" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Add Time of Birth (optional)
        </label>
      </div>

      {showTime && (
        <div className="grid grid-cols-3 gap-4 animate-fade-in">
          {createInputField('Hour', 'HH', time.hour, (e) => setTime({ ...time, hour: e.target.value }), 'hour')}
          {createInputField('Minute', 'MM', time.minute, (e) => setTime({ ...time, minute: e.target.value }), 'minute')}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
            <select
              id="period"
              value={time.period}
              onChange={(e) => setTime({ ...time, period: e.target.value })}
              className="mt-1 block w-full input-style"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <div className="flex items-center">
            <input
              type="checkbox"
              id="saveData"
              checked={save}
              onChange={handleSaveToggle}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="saveData" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Save for next time
            </label>
        </div>
        <div className="flex gap-4">
            {hasResult && (
                <button
                    onClick={handleClear}
                    aria-label="Clear and start over"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <RotateCw className="w-4 h-4" /> Reset
                </button>
            )}
            <button
                onClick={calculateAge}
                aria-label="Calculate age"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl"
            >
                <Sparkles className="w-5 h-5" /> Calculate
            </button>
        </div>
      </div>
    </div>
  );
};


const createInputField = (label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, id: string) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="number"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full input-style"
      aria-label={`Enter ${label}`}
    />
  </div>
);

// Calculation helpers
const getZodiacSign = (day: number, month: number): string => {
  const signs = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn"];
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  return day < dates[month-1] ? signs[month-1] : signs[month];
};

const getChineseZodiac = (year: number): string => {
  const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep"];
  return animals[(year - 1900) % 12];
};

const performCalculations = (birthDate: Date): CalculationResult => {
    const now = new Date();
    
    // Age calculation
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    if (seconds < 0) { minutes--; seconds += 60; }
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { days--; hours += 24; }
    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) { years--; months += 12; }

    // Next birthday countdown
    const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const diff = nextBirthday.getTime() - now.getTime();
    const countdownDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const countdownHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const countdownSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
        age: { years, months, days, hours, minutes, seconds },
        nextBirthdayCountdown: { days: countdownDays, hours: countdownHours, minutes: countdownMinutes, seconds: countdownSeconds },
        zodiacSign: getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1),
        dayOfWeek: birthDate.toLocaleDateString('en-US', { weekday: 'long' }),
        chineseZodiac: getChineseZodiac(birthDate.getFullYear()),
        birthDate
    };
};
