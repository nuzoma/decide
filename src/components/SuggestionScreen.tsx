import React from 'react';
import { Meal, EnergyChoice } from '../types';
import { ArrowLeft } from 'lucide-react';

interface SuggestionScreenProps {
  currentMeal: Meal | null;
  energy: EnergyChoice;
  rejectionCount: number;
  maxRejections: number;
  remainingMatches: Meal[];
  ignoredRecencyRule: boolean;
  isEmptyForEnergy: boolean;
  onCookMeal: (meal: Meal) => void;
  onRejectMeal: () => void;
  onLogOrderedFood: () => void;
  onNavigateToHome: () => void;
  onNavigateToAddMeal: () => void;
  onResetSession: () => void;
}

export const SuggestionScreen: React.FC<SuggestionScreenProps> = ({
  currentMeal,
  rejectionCount,
  maxRejections,
  remainingMatches,
  isEmptyForEnergy,
  onCookMeal,
  onRejectMeal,
  onLogOrderedFood,
  onNavigateToHome,
  onNavigateToAddMeal,
  onResetSession,
}) => {
  // Empty state
  if (isEmptyForEnergy || (!currentMeal && rejectionCount === 0)) {
    return (
      <div className="w-full max-w-sm mx-auto px-6 py-12 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
        <button
          onClick={onNavigateToHome}
          className="self-start text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="text-center py-12 flex flex-col items-center gap-3">
          <h2 className="text-xl font-light text-[var(--text-main)]">
            No matching meals
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-xs">
            There are no meals with this effort tag in your list yet.
          </p>
          <button
            onClick={onNavigateToAddMeal}
            className="mt-4 px-4 py-2.5 text-xs font-semibold bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
          >
            Add a meal
          </button>
        </div>

        <div />
      </div>
    );
  }

  // 3 rejections reached -> PRD requirement: "Pick one of these or order."
  const isMaxRejectionsReached = rejectionCount >= maxRejections;

  if (isMaxRejectionsReached) {
    return (
      <div className="w-full max-w-sm mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-4">
          <button
            onClick={onNavigateToHome}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            3 of 3 rejected
          </span>
        </div>

        <div>
          <h1 className="text-xl font-medium tracking-tight text-[var(--text-main)]">
            Pick one of these or order.
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Tap a meal to cook it, or choose to order.
          </p>
        </div>

        {/* Minimal Hairline List */}
        <div className="divide-y divide-[var(--border-line)] border-y border-[var(--border-line)]">
          {remainingMatches.length > 0 ? (
            remainingMatches.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onCookMeal(meal)}
                className="w-full py-3.5 px-1 flex items-center justify-between text-left hover:bg-[var(--bg-surface-subtle)] transition-colors group"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--text-main)]">
                    {meal.name}
                  </div>
                  {meal.notes && (
                    <div className="text-xs text-[var(--text-muted)]">{meal.notes}</div>
                  )}
                </div>
                <span className="text-xs text-[var(--text-faint)] group-hover:text-[var(--text-main)] font-mono">
                  Cook &gt;
                </span>
              </button>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-[var(--text-faint)]">
              No further meals left for this energy level.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onLogOrderedFood}
            className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider border border-[var(--border-strong)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] transition-colors"
          >
            I ordered food
          </button>

          <button
            onClick={onResetSession}
            className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] text-center"
          >
            Back to energy selection
          </button>
        </div>
      </div>
    );
  }

  // Active Single Meal Suggestion
  return (
    <div className="w-full max-w-sm mx-auto px-6 py-8 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateToHome}
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <span className="text-[11px] font-mono text-[var(--text-faint)]">
          {maxRejections - rejectionCount} {maxRejections - rejectionCount === 1 ? 'pass left' : 'passes left'}
        </span>
      </div>

      {/* Center Meal Presentation */}
      <div className="py-12 flex flex-col items-center text-center gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)]">
          {currentMeal?.effort} effort
        </span>

        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)] text-balance">
          {currentMeal?.name}
        </h1>

        {currentMeal?.notes && (
          <p className="text-xs text-[var(--text-muted)] max-w-xs mt-1">
            {currentMeal.notes}
          </p>
        )}
      </div>

      {/* Bottom Actions: Two stark buttons */}
      <div className="flex flex-col gap-2.5 pb-6">
        <button
          onClick={() => currentMeal && onCookMeal(currentMeal)}
          className="w-full py-4 px-5 text-sm font-semibold tracking-wide uppercase bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 active:scale-[0.99] transition-all"
        >
          I'll cook this
        </button>

        <button
          onClick={onRejectMeal}
          className="w-full py-3.5 px-5 text-xs font-semibold tracking-wide uppercase border border-[var(--border-line)] hover:border-[var(--text-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-[0.99] transition-all"
        >
          Not this one
        </button>
      </div>
    </div>
  );
};
