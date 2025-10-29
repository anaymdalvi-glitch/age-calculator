
import React, { useState, useCallback } from 'react';
import { CalculationResult, FunFacts } from '../types';
import { getBirthDateFacts } from '../services/geminiService';
import { Sparkles, Loader2, AlertTriangle, User, History } from 'lucide-react';

interface FunFactsCardProps {
  result: CalculationResult;
}

export const FunFactsCard: React.FC<FunFactsCardProps> = ({ result }) => {
  const [facts, setFacts] = useState<FunFacts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFacts(null);
    try {
      const fetchedFacts = await getBirthDateFacts(result);
      setFacts(fetchedFacts);
    } catch (err) {
      setError('Could not fetch fun facts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [result]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
      {!facts && !loading && !error && (
         <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Want to know more?</h3>
            <p className="text-gray-600 dark:text-gray-400">Discover AI-powered fun facts about your birthday!</p>
            <button
                onClick={fetchFacts}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl"
            >
                <Sparkles className="w-5 h-5" /> Get Fun Facts
            </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Our AI is time-traveling for your facts...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-red-500">
          <AlertTriangle className="w-10 h-10" />
          <p>{error}</p>
           <button
                onClick={fetchFacts}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
                Try Again
            </button>
        </div>
      )}

      {facts && (
        <div className="animate-fade-in text-left space-y-6">
            <h3 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Your Birthday Snapshot</h3>
            <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-yellow-500" /> Personality Trait</h4>
                <p className="text-gray-600 dark:text-gray-400">{facts.personalityTrait}</p>
            </div>
            <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2"><User className="w-5 h-5 text-green-500" /> Famous Peers</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    {facts.famousPeers.map((peer, index) => <li key={index}>{peer}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2"><History className="w-5 h-5 text-orange-500" /> On This Day in History</h4>
                <p className="text-gray-600 dark:text-gray-400">{facts.historicalEvent}</p>
            </div>
        </div>
      )}
    </div>
  );
};
