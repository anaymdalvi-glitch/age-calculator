
export interface Age {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CalculationResult {
  age: Age;
  nextBirthdayCountdown: Countdown;
  zodiacSign: string;
  dayOfWeek: string;
  chineseZodiac: string;
  birthDate: Date;
}

export interface FunFacts {
  personalityTrait: string;
  famousPeers: string[];
  historicalEvent: string;
}
