import { Meal, LogEntry, EnergyChoice, EffortLevel } from '../types';
import { getTodayString } from './storage';

export function isEffortAllowed(effort: EffortLevel, energy: EnergyChoice): boolean {
  switch (energy) {
    case 'lazy':
      return effort === 'minimum';
    case 'okay':
      return effort === 'minimum' || effort === 'normal';
    case 'motivated':
      return true; // minimum, normal, and batch
  }
}

/**
 * Calculates calendar day difference between dateString (YYYY-MM-DD) and referenceDate (default today)
 */
export function getCalendarDayDifference(dateString: string, refDateString: string = getTodayString()): number {
  const [y1, m1, d1] = dateString.split('-').map(Number);
  const [y2, m2, d2] = refDateString.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Checks if a meal was logged as cooked in the last 2 days (i.e. diffDays >= 0 and diffDays <= 2).
 */
export function wasCookedInLast2Days(mealId: string, log: LogEntry[], todayStr: string = getTodayString()): boolean {
  return log.some((entry) => {
    if (entry.type !== 'cooked' || entry.mealId !== mealId) return false;
    const diff = getCalendarDayDifference(entry.date, todayStr);
    return diff >= 0 && diff <= 2;
  });
}

export interface SelectionResult {
  selectedMeal: Meal | null;
  allowedMeals: Meal[];
  remainingMatches: Meal[];
  ignoredRecencyRule: boolean;
  emptyForEnergyLevel: boolean;
}

export function pickMealForEnergy(
  meals: Meal[],
  log: LogEntry[],
  energy: EnergyChoice,
  rejectedIds: string[] = []
): SelectionResult {
  // Step 1: Collect meals allowed for that energy level
  const allowedMeals = meals.filter((m) => isEffortAllowed(m.effort, energy));

  if (allowedMeals.length === 0) {
    return {
      selectedMeal: null,
      allowedMeals: [],
      remainingMatches: [],
      ignoredRecencyRule: false,
      emptyForEnergyLevel: true,
    };
  }

  // Step 2: Remove any meal logged as cooked in the last 2 days
  const todayStr = getTodayString();
  const nonRecentMeals = allowedMeals.filter((m) => !wasCookedInLast2Days(m.id, log, todayStr));

  // Step 3: Remove any meal already rejected in this request
  const rejectedSet = new Set(rejectedIds);
  const candidatesFromNonRecent = nonRecentMeals.filter((m) => !rejectedSet.has(m.id));

  // Step 4: Pick one at random from what remains
  if (candidatesFromNonRecent.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidatesFromNonRecent.length);
    const selectedMeal = candidatesFromNonRecent[randomIndex];
    const remainingMatches = candidatesFromNonRecent.filter((m) => m.id !== selectedMeal.id);
    return {
      selectedMeal,
      allowedMeals,
      remainingMatches,
      ignoredRecencyRule: false,
      emptyForEnergyLevel: false,
    };
  }

  // Step 5: If nothing remains after step 2, ignore the 2-day rule and try again (step 1 minus rejections)
  const candidatesIgnoringRecency = allowedMeals.filter((m) => !rejectedSet.has(m.id));

  if (candidatesIgnoringRecency.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidatesIgnoringRecency.length);
    const selectedMeal = candidatesIgnoringRecency[randomIndex];
    const remainingMatches = candidatesIgnoringRecency.filter((m) => m.id !== selectedMeal.id);
    return {
      selectedMeal,
      allowedMeals,
      remainingMatches,
      ignoredRecencyRule: true,
      emptyForEnergyLevel: false,
    };
  }

  // If still nothing (i.e. all allowed meals were rejected in this session)
  return {
    selectedMeal: null,
    allowedMeals,
    remainingMatches: [],
    ignoredRecencyRule: true,
    emptyForEnergyLevel: false,
  };
}
