export type EffortLevel = 'minimum' | 'normal' | 'batch';

export type EnergyChoice = 'lazy' | 'okay' | 'motivated';

export interface Meal {
  id: string;
  name: string;
  effort: EffortLevel;
  notes?: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'cooked' | 'ordered';
  mealId?: string; // only present if type === 'cooked'
  mealName?: string; // stored snapshot in case meal was later deleted/renamed
  createdAt: string; // ISO timestamp
}

export interface AppData {
  meals: Meal[];
  log: LogEntry[];
}

export type ActiveScreen = 'home' | 'suggestion' | 'meals' | 'summary';
