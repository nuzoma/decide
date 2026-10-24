import React from 'react';
import { EnergyChoice, LogEntry, Meal } from '../types';

interface HomeScreenProps {
  onSelectEnergy: (energy: EnergyChoice) => void;
  onLogOrderedFood: () => void;
  onNavigateToMeals: () => void;
  onNavigateToSummary: () => void;
  todayLogs: LogEntry[];
  meals: Meal[];
  onUndoLastLog?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectEnergy,
  onLogOrderedFood,
  todayLogs,
  onUndoLastLog,
}) => {
  const latestLog = todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null;

  return (
    <div className="w-full max-w-sm mx-auto px-6 py-12 sm:py-16 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {/* Top Spacer / Minimal Title */}
      <div className="flex flex-col items-center justify-center text-center pt-8 pb-12">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-main)]">
          Decide<span className="font-thin text-[var(--text-faint)]">.|</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-2 font-mono uppercase tracking-widest">
          Choose your energy
        </p>
      </div>

      {/* The 3 Core Energy Buttons + Ordering Button (Clean, crisp, rectangular like inspiration image) */}
      <div className="flex flex-col gap-3 w-full">
        {/* Lazy Button */}
        <button
          onClick={() => onSelectEnergy('lazy')}
          className="w-full py-4 px-5 text-left bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-between"
        >
          <span className="text-base font-semibold tracking-wide">Lazy</span>
          <span className="text-xs font-mono opacity-70">10m prep</span>
        </button>

        {/* Okay Button */}
        <button
          onClick={() => onSelectEnergy('okay')}
          className="w-full py-4 px-5 text-left border border-[var(--border-strong)] bg-transparent hover:bg-[var(--bg-surface-subtle)] text-[var(--text-main)] active:scale-[0.99] transition-all flex items-center justify-between"
        >
          <span className="text-base font-semibold tracking-wide">Okay</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Everyday meals</span>
        </button>

        {/* Motivated Button */}
        <button
          onClick={() => onSelectEnergy('motivated')}
          className="w-full py-4 px-5 text-left border border-[var(--border-strong)] bg-transparent hover:bg-[var(--bg-surface-subtle)] text-[var(--text-main)] active:scale-[0.99] transition-all flex items-center justify-between"
        >
          <span className="text-base font-semibold tracking-wide">Motivated</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Includes batch</span>
        </button>

        {/* I Ordered Food - Outlined single-tap button */}
        <div className="pt-4">
          <button
            onClick={onLogOrderedFood}
            className="w-full py-3.5 px-5 text-center border border-[var(--border-line)] hover:border-[var(--text-main)] text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-[0.99] transition-all"
          >
            I ordered food
          </button>
        </div>
      </div>

      {/* Quiet Bottom Status: Only shown if something was logged today */}
      <div className="pt-8 pb-4 text-center min-h-[40px] flex items-center justify-center">
        {latestLog ? (
          <div className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <span>
              Today: {latestLog.type === 'cooked' ? `Cooked ${latestLog.mealName || 'meal'}` : 'Ordered food'}
            </span>
            {onUndoLastLog && (
              <button
                onClick={onUndoLastLog}
                className="underline underline-offset-2 text-[var(--text-main)] hover:opacity-80 font-medium ml-1"
              >
                Undo
              </button>
            )}
          </div>
        ) : (
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            Ready when you are
          </span>
        )}
      </div>
    </div>
  );
};
