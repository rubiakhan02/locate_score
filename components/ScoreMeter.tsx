
import React from 'https://esm.sh/react@19.2.3';

interface ScoreMeterProps {
  score: number;
  label: string;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ score, label }) => {
  const getStrokeColor = (val: number) => {
    if (val >= 80) return '#10b981'; // emerald-500
    if (val >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={getStrokeColor(score)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-900">{score}</span>
          <span className="text-sm text-slate-500 font-medium">/ 100</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <span className={`text-xl font-bold uppercase tracking-widest ${
          score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'
        }`}>
          {label}
        </span>
        <p className="text-slate-500 text-sm mt-1">Overall Location Quality</p>
      </div>
    </div>
  );
};

export default ScoreMeter;