import React, { useState, useRef, useEffect } from 'react';
import { Meal, EffortLevel } from '../types';
import { Plus, X, Trash2 } from 'lucide-react';

interface MealListScreenProps {
  meals: Meal[];
  onAddMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  onUpdateMeal: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  onNavigateToHome: () => void;
}

export const MealListScreen: React.FC<MealListScreenProps> = ({
  meals,
  onAddMeal,
  onUpdateMeal,
  onDeleteMeal,
}) => {
  const [filter, setFilter] = useState<'all' | EffortLevel>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Add form fields
  const [name, setName] = useState('');
  const [effort, setEffort] = useState<EffortLevel>('minimum');
  const [notes, setNotes] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      nameInputRef.current?.focus();
    }
  }, [isAdding]);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddMeal({
      name: trimmed,
      effort,
      notes: notes.trim() || undefined,
    });
    setName('');
    setEffort('minimum');
    setNotes('');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeal) return;
    const trimmed = selectedMeal.name.trim();
    if (!trimmed) return;
    onUpdateMeal({
      ...selectedMeal,
      name: trimmed,
      notes: selectedMeal.notes?.trim() || undefined,
    });
    setSelectedMeal(null);
  };

  const filteredMeals = filter === 'all' ? meals : meals.filter((m) => m.effort === filter);
  const minCount = meals.filter((m) => m.effort === 'minimum').length;

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-6">
      {/* Screen Title & Add Trigger (Matches mp1_5ef4a9c6.jpg Folders view) */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-line)]">
        <h1 className="text-xl font-light tracking-tight text-[var(--text-main)]">
          Meals
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="w-8 h-8 rounded-full border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] transition-colors"
          title="Add a meal"
          aria-label="Add a meal"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quiet Segmented Filter */}
      <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border-line)] pb-3">
        {(['all', 'minimum', 'normal', 'batch'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`capitalize transition-colors ${
              filter === tab
                ? 'text-[var(--text-main)] font-semibold border-b border-[var(--text-main)] pb-0.5'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Fast Add Modal */}
      {isAdding && (
        <form
          onSubmit={handleSaveNew}
          className="p-5 border border-[var(--border-strong)] bg-[var(--bg-canvas)] flex flex-col gap-4 animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
              New Meal
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={nameInputRef}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Meal name"
            className="w-full px-3 py-2 text-sm bg-transparent border-b border-[var(--border-strong)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />

          <div className="grid grid-cols-3 gap-2">
            {(['minimum', 'normal', 'batch'] as EffortLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEffort(lvl)}
                className={`py-2 text-xs capitalize border ${
                  effort === lvl
                    ? 'border-[var(--border-strong)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium'
                    : 'border-[var(--border-line)] text-[var(--text-muted)]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="One-line note (optional)"
            className="w-full px-3 py-1.5 text-xs bg-transparent border-b border-[var(--border-line)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[var(--text-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      {selectedMeal && (
        <form
          onSubmit={handleSaveEdit}
          className="p-5 border border-[var(--border-strong)] bg-[var(--bg-canvas)] flex flex-col gap-4 animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
              Edit Meal
            </span>
            <button
              type="button"
              onClick={() => setSelectedMeal(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            required
            value={selectedMeal.name}
            onChange={(e) => setSelectedMeal({ ...selectedMeal, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-transparent border-b border-[var(--border-strong)] text-[var(--text-main)] focus:outline-none"
          />

          <div className="grid grid-cols-3 gap-2">
            {(['minimum', 'normal', 'batch'] as EffortLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedMeal({ ...selectedMeal, effort: lvl })}
                className={`py-2 text-xs capitalize border ${
                  selectedMeal.effort === lvl
                    ? 'border-[var(--border-strong)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium'
                    : 'border-[var(--border-line)] text-[var(--text-muted)]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={selectedMeal.notes || ''}
            onChange={(e) => setSelectedMeal({ ...selectedMeal, notes: e.target.value })}
            placeholder="One-line note (optional)"
            className="w-full px-3 py-1.5 text-xs bg-transparent border-b border-[var(--border-line)] text-[var(--text-main)] focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${selectedMeal.name}"?`)) {
                  onDeleteMeal(selectedMeal.id);
                  setSelectedMeal(null);
                }
              }}
              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedMeal(null)}
                className="text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Serene Clean List (Directly matches mp1_5ef4a9c6.jpg hairline rows) */}
      <div className="divide-y divide-[var(--border-line)] border-b border-[var(--border-line)]">
        {filteredMeals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => setSelectedMeal(meal)}
            className="w-full py-4 px-1 flex items-center justify-between text-left hover:bg-[var(--bg-surface-subtle)]/50 transition-colors group"
          >
            <div className="pr-3">
              <div className="text-sm text-[var(--text-main)]">
                {meal.name}
              </div>
              {meal.notes && (
                <div className="text-xs text-[var(--text-muted)] font-light">
                  {meal.notes}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-faint)] group-hover:text-[var(--text-main)] shrink-0">
              <span className="capitalize">{meal.effort}</span>
              <span>&gt;</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quiet Footer Note */}
      {minCount < 3 && (
        <div className="text-xs text-[var(--text-muted)] italic text-center pt-2">
          Only {minCount} minimum meals. Adding quick 10m meals helps on lazy days.
        </div>
      )}
    </div>
  );
};
