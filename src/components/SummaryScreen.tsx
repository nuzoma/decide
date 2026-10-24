import React, { useState, useRef } from 'react';
import { AppData } from '../types';
import { getTodayString, exportBackup, parseAndValidateBackup } from '../utils/storage';
import { getCalendarDayDifference } from '../utils/selection';
import { Trash2 } from 'lucide-react';

interface SummaryScreenProps {
  appData: AppData;
  onRestoreData: (newData: AppData) => void;
  onResetSeedList: () => void;
  onDeleteLogEntry: (entryId: string) => void;
  onNavigateToHome: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  appData,
  onRestoreData,
  onResetSeedList,
  onDeleteLogEntry,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { meals, log } = appData;
  const todayStr = getTodayString();

  // Last 14 days logs
  const last14DaysLogs = log.filter((entry) => {
    const diff = getCalendarDayDifference(entry.date, todayStr);
    return diff >= 0 && diff < 14;
  });

  // 1. Days cooked
  const cookedDates = new Set(
    last14DaysLogs.filter((e) => e.type === 'cooked').map((e) => e.date)
  );
  const daysCooked = cookedDates.size;

  // 2. Times ordered
  const timesOrdered = last14DaysLogs.filter((e) => e.type === 'ordered').length;

  // 3. Most-cooked meal
  const mealCookCounts: Record<string, { name: string; count: number }> = {};
  last14DaysLogs.forEach((entry) => {
    if (entry.type === 'cooked') {
      const meal = meals.find((m) => m.id === entry.mealId);
      const mealName = meal ? meal.name : entry.mealName || 'Unknown meal';
      const key = entry.mealId || mealName;
      if (!mealCookCounts[key]) {
        mealCookCounts[key] = { name: mealName, count: 0 };
      }
      mealCookCounts[key].count += 1;
    }
  });

  const mostCookedMeal = Object.values(mealCookCounts).reduce<
    { name: string; count: number } | null
  >((prev, curr) => {
    if (!prev || curr.count > prev.count) return curr;
    return prev;
  }, null);

  const handleExport = () => {
    try {
      exportBackup(appData);
      setStatusMessage('Backup exported.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage('Export failed.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseAndValidateBackup(content);
        if (window.confirm(`Import will restore ${parsed.meals.length} meals and ${parsed.log.length} logs. Continue?`)) {
          onRestoreData(parsed);
          setStatusMessage('Backup imported.');
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } catch (err: unknown) {
        setStatusMessage(err instanceof Error ? err.message : 'Invalid backup JSON file.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Title */}
      <div className="pb-2 border-b border-[var(--border-line)]">
        <h1 className="text-xl font-light tracking-tight text-[var(--text-main)]">
          14 Days
        </h1>
      </div>

      {/* 3 Core Stats - Ultra clean, uncluttered presentation */}
      <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[var(--border-line)]">
        <div>
          <div className="text-2xl font-light tracking-tight tabular-nums text-[var(--text-main)]">
            {daysCooked} <span className="text-xs text-[var(--text-muted)] font-mono">days</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Cooked at home</div>
        </div>

        <div>
          <div className="text-2xl font-light tracking-tight tabular-nums text-[var(--text-main)]">
            {timesOrdered} <span className="text-xs text-[var(--text-muted)] font-mono">times</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">Ordered food</div>
        </div>

        <div className="col-span-2 pt-2 border-t border-[var(--border-line)]">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
            Most-Cooked
          </div>
          <div className="text-base font-medium text-[var(--text-main)] mt-1">
            {mostCookedMeal ? `${mostCookedMeal.name} (${mostCookedMeal.count}×)` : 'None logged yet'}
          </div>
        </div>
      </div>

      {/* Activity Log in the last 14 days */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
          Recent Activity
        </div>

        {last14DaysLogs.length === 0 ? (
          <div className="py-6 text-xs text-[var(--text-faint)] italic">
            No cooking or orders logged in the last 14 days.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-line)] border-y border-[var(--border-line)]">
            {last14DaysLogs.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="py-3 flex items-center justify-between text-xs hover:bg-[var(--bg-surface-subtle)]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[var(--text-faint)]">{entry.date}</span>
                  <span className="font-medium text-[var(--text-main)]">
                    {entry.type === 'cooked'
                      ? entry.mealName || meals.find((m) => m.id === entry.mealId)?.name || 'Cooked meal'
                      : 'Ordered food'}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteLogEntry(entry.id)}
                  className="p-1 text-[var(--text-faint)] hover:text-red-600 transition-colors"
                  title="Remove"
                  aria-label="Remove entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiet Backup & Reset */}
      <div className="pt-6 border-t border-[var(--border-line)] flex flex-col gap-3">
        {statusMessage && (
          <div className="text-xs text-[var(--text-main)] italic">{statusMessage}</div>
        )}

        <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
          <button
            onClick={handleExport}
            className="hover:text-[var(--text-main)] underline underline-offset-4"
          >
            Export JSON
          </button>
          <span>·</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:text-[var(--text-main)] underline underline-offset-4"
          >
            Import JSON
          </button>
          <span>·</span>
          <button
            onClick={() => {
              if (window.confirm('Reset meal list to default starter meals?')) {
                onResetSeedList();
                setStatusMessage('Reset to starter meals.');
              }
            }}
            className="hover:text-[var(--text-main)] underline underline-offset-4"
          >
            Reset
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
