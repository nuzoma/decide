import { AppData, Meal, LogEntry } from '../types';
import { SEED_MEALS } from '../data/seedMeals';

const STORAGE_KEY = 'meal_decider_data_v1';
const THEME_KEY = 'meal_decider_theme_v1';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AppData = {
        meals: [...SEED_MEALS],
        log: [],
      };
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid storage format');
    }

    const meals: Meal[] = Array.isArray(parsed.meals)
      ? parsed.meals.filter(
          (m: unknown): m is Meal =>
            Boolean(m) &&
            typeof m === 'object' &&
            typeof (m as Meal).name === 'string' &&
            ['minimum', 'normal', 'batch'].includes((m as Meal).effort)
        )
      : [...SEED_MEALS];

    const log: LogEntry[] = Array.isArray(parsed.log)
      ? parsed.log.filter(
          (l: unknown): l is LogEntry =>
            Boolean(l) &&
            typeof l === 'object' &&
            typeof (l as LogEntry).date === 'string' &&
            ['cooked', 'ordered'].includes((l as LogEntry).type)
        )
      : [];

    return {
      meals: meals.length > 0 ? meals : [...SEED_MEALS],
      log,
    };
  } catch (error) {
    console.error('Failed to load meal decider data from localStorage:', error);
    return {
      meals: [...SEED_MEALS],
      log: [],
    };
  }
}

export function saveAppData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save meal decider data to localStorage:', error);
    return false;
  }
}

export function exportBackup(data: AppData): void {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-decider-backup-${getTodayString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export backup:', error);
    throw new Error('Could not create backup download.');
  }
}

export function parseAndValidateBackup(jsonString: string): AppData {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON backup file.');
  }

  if (!Array.isArray(parsed.meals)) {
    throw new Error('Backup file is missing the "meals" list.');
  }

  const validEfforts = ['minimum', 'normal', 'batch'];
  const sanitizedMeals: Meal[] = parsed.meals.map((m: unknown, idx: number) => {
    if (!m || typeof m !== 'object') {
      throw new Error(`Meal at index ${idx} is invalid.`);
    }
    const item = m as Record<string, unknown>;
    const name = String(item.name || '').trim();
    if (!name) {
      throw new Error(`Meal at index ${idx} is missing a name.`);
    }
    const effort = String(item.effort || 'normal').toLowerCase();
    if (!validEfforts.includes(effort)) {
      throw new Error(`Meal "${name}" has invalid effort tag: "${effort}".`);
    }

    return {
      id: typeof item.id === 'string' && item.id ? item.id : `meal-${Date.now()}-${idx}`,
      name,
      effort: effort as 'minimum' | 'normal' | 'batch',
      notes: typeof item.notes === 'string' ? item.notes : '',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    };
  });

  const sanitizedLog: LogEntry[] = Array.isArray(parsed.log)
    ? parsed.log
        .filter((l: unknown): l is Record<string, unknown> => Boolean(l) && typeof l === 'object')
        .map((l: Record<string, unknown>, idx: number) => {
          const type = l.type === 'ordered' ? 'ordered' : 'cooked';
          const date = typeof l.date === 'string' && l.date ? l.date : getTodayString();
          return {
            id: typeof l.id === 'string' && l.id ? l.id : `log-${Date.now()}-${idx}`,
            date,
            type,
            mealId: typeof l.mealId === 'string' ? l.mealId : undefined,
            mealName: typeof l.mealName === 'string' ? l.mealName : undefined,
            createdAt: typeof l.createdAt === 'string' ? l.createdAt : new Date().toISOString(),
          };
        })
    : [];

  return {
    meals: sanitizedMeals,
    log: sanitizedLog,
  };
}

export function loadThemePreference(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore
  }
}
