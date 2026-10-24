import React, { useState, useEffect, useCallback } from 'react';
import { ActiveScreen, AppData, EnergyChoice, LogEntry, Meal } from './types';
import {
  loadAppData,
  saveAppData,
  getTodayString,
  loadThemePreference,
  saveThemePreference,
} from './utils/storage';
import { pickMealForEnergy } from './utils/selection';
import { SEED_MEALS } from './data/seedMeals';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { SuggestionScreen } from './components/SuggestionScreen';
import { MealListScreen } from './components/MealListScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { Toast } from './components/Toast';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadThemePreference());
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  // Suggestion request session state
  const [currentEnergy, setCurrentEnergy] = useState<EnergyChoice>('lazy');
  const [currentSuggestedMeal, setCurrentSuggestedMeal] = useState<Meal | null>(null);
  const [rejectedMealIds, setRejectedMealIds] = useState<string[]>([]);
  const [remainingMatches, setRemainingMatches] = useState<Meal[]>([]);
  const [ignoredRecency, setIgnoredRecency] = useState<boolean>(false);
  const [isEmptyForEnergy, setIsEmptyForEnergy] = useState<boolean>(false);

  // Toast and Undo state
  const [toast, setToast] = useState<{ message: string; onUndo?: () => void } | null>(null);
  const [lastLoggedEntryId, setLastLoggedEntryId] = useState<string | null>(null);

  // Synchronize theme with html tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemePreference(theme);
  }, [theme]);

  // Synchronize appData with localStorage
  const updateAppData = useCallback((updater: (prev: AppData) => AppData) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to trigger Undo for a log entry
  const handleUndoLog = useCallback((entryId: string, description: string) => {
    updateAppData((prev) => ({
      ...prev,
      log: prev.log.filter((entry) => entry.id !== entryId),
    }));
    setToast({
      message: `Undone: Removed "${description}" from today's log.`,
    });
    setTimeout(() => {
      setToast((current) => (current?.message.startsWith('Undone') ? null : current));
    }, 3500);
  }, [updateAppData]);

  // Handle Energy Selection from Home Screen
  const handleSelectEnergy = (energy: EnergyChoice) => {
    setCurrentEnergy(energy);
    setRejectedMealIds([]);

    const result = pickMealForEnergy(appData.meals, appData.log, energy, []);

    if (result.emptyForEnergyLevel || !result.selectedMeal) {
      setCurrentSuggestedMeal(null);
      setRemainingMatches([]);
      setIgnoredRecency(false);
      setIsEmptyForEnergy(true);
    } else {
      setCurrentSuggestedMeal(result.selectedMeal);
      setRemainingMatches(result.remainingMatches);
      setIgnoredRecency(result.ignoredRecencyRule);
      setIsEmptyForEnergy(false);
    }

    setActiveScreen('suggestion');
  };

  // Handle "I'll cook this" from Suggestion Screen
  const handleCookMeal = (meal: Meal) => {
    const todayStr = getTodayString();
    const newEntryId = `log-${Date.now()}`;
    const newEntry: LogEntry = {
      id: newEntryId,
      date: todayStr,
      type: 'cooked',
      mealId: meal.id,
      mealName: meal.name,
      createdAt: new Date().toISOString(),
    };

    updateAppData((prev) => ({
      ...prev,
      log: [...prev.log, newEntry],
    }));

    setLastLoggedEntryId(newEntryId);
    setActiveScreen('home');

    setToast({
      message: `Logged: Cooked "${meal.name}" today.`,
      onUndo: () => handleUndoLog(newEntryId, meal.name),
    });
  };

  // Handle "Not this one" from Suggestion Screen
  const handleRejectMeal = () => {
    if (!currentSuggestedMeal) return;

    const newRejected = [...rejectedMealIds, currentSuggestedMeal.id];
    setRejectedMealIds(newRejected);

    if (newRejected.length >= 3) {
      // 3 rejections reached: PRD F5 requires showing message "Pick one of these or order." and remaining matches
      // Compute remaining matches from allowed meals minus all rejected
      const allowed = appData.meals.filter((m) => {
        if (currentEnergy === 'lazy') return m.effort === 'minimum';
        if (currentEnergy === 'okay') return m.effort === 'minimum' || m.effort === 'normal';
        return true;
      });
      const remaining = allowed.filter((m) => !newRejected.includes(m.id));
      setRemainingMatches(remaining);
      return;
    }

    const result = pickMealForEnergy(appData.meals, appData.log, currentEnergy, newRejected);

    if (result.selectedMeal) {
      setCurrentSuggestedMeal(result.selectedMeal);
      setRemainingMatches(result.remainingMatches);
      setIgnoredRecency(result.ignoredRecencyRule);
    } else {
      // No more candidates available even before 3 rejections
      const allowed = appData.meals.filter((m) => {
        if (currentEnergy === 'lazy') return m.effort === 'minimum';
        if (currentEnergy === 'okay') return m.effort === 'minimum' || m.effort === 'normal';
        return true;
      });
      const remaining = allowed.filter((m) => !newRejected.includes(m.id));
      setRemainingMatches(remaining);
      // Force limit so fallback screen shows
      setRejectedMealIds(new Array(3).fill('dummy'));
    }
  };

  // Handle "I ordered food" from Home or Suggestion Screen (PRD F7)
  const handleLogOrderedFood = () => {
    const todayStr = getTodayString();
    const newEntryId = `log-${Date.now()}`;
    const newEntry: LogEntry = {
      id: newEntryId,
      date: todayStr,
      type: 'ordered',
      createdAt: new Date().toISOString(),
    };

    updateAppData((prev) => ({
      ...prev,
      log: [...prev.log, newEntry],
    }));

    setLastLoggedEntryId(newEntryId);
    setActiveScreen('home');

    setToast({
      message: 'Logged: Ordered food for today.',
      onUndo: () => handleUndoLog(newEntryId, 'Ordered food'),
    });
  };

  // Reset decision session to start fresh
  const handleResetSession = () => {
    setRejectedMealIds([]);
    setCurrentSuggestedMeal(null);
    setRemainingMatches([]);
    setActiveScreen('home');
  };

  // Meal list actions
  const handleAddMeal = (newMealData: Omit<Meal, 'id' | 'createdAt'>) => {
    const newMeal: Meal = {
      ...newMealData,
      id: `meal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    updateAppData((prev) => ({
      ...prev,
      meals: [newMeal, ...prev.meals],
    }));
    setToast({ message: `Added "${newMeal.name}" to meal list.` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateMeal = (updatedMeal: Meal) => {
    updateAppData((prev) => ({
      ...prev,
      meals: prev.meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m)),
    }));
    setToast({ message: `Updated "${updatedMeal.name}".` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteMeal = (mealId: string) => {
    const deletedMeal = appData.meals.find((m) => m.id === mealId);
    updateAppData((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== mealId),
    }));
    setToast({
      message: `Deleted "${deletedMeal?.name || 'Meal'}".`,
      onUndo: deletedMeal
        ? () => {
            updateAppData((prev) => ({
              ...prev,
              meals: [...prev.meals, deletedMeal],
            }));
            setToast({ message: `Restored "${deletedMeal.name}".` });
          }
        : undefined,
    });
  };

  // Summary screen actions
  const handleRestoreData = (importedData: AppData) => {
    updateAppData(() => importedData);
  };

  const handleResetSeedList = () => {
    updateAppData((prev) => ({
      ...prev,
      meals: [...SEED_MEALS],
    }));
  };

  const handleDeleteLogEntry = (entryId: string) => {
    const entry = appData.log.find((e) => e.id === entryId);
    const desc = entry?.type === 'cooked' ? entry.mealName || 'Cooked meal' : 'Ordered food';
    handleUndoLog(entryId, desc);
  };

  // Filter today's activity logs
  const todayStr = getTodayString();
  const todayLogs = appData.log.filter((e) => e.date === todayStr);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col font-sans transition-colors">
      {/* Universal Top Bar */}
      <Header
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        mealCount={appData.meals.length}
      />

      {/* Main Responsive Canvas */}
      <main className="flex-1 w-full pb-16">
        {activeScreen === 'home' && (
          <HomeScreen
            onSelectEnergy={handleSelectEnergy}
            onLogOrderedFood={handleLogOrderedFood}
            onNavigateToMeals={() => setActiveScreen('meals')}
            onNavigateToSummary={() => setActiveScreen('summary')}
            todayLogs={todayLogs}
            meals={appData.meals}
            onUndoLastLog={
              todayLogs.length > 0 && lastLoggedEntryId
                ? () => {
                    const latest = todayLogs.find((l) => l.id === lastLoggedEntryId) || todayLogs[todayLogs.length - 1];
                    handleUndoLog(latest.id, latest.type === 'cooked' ? latest.mealName || 'Cooked meal' : 'Ordered food');
                  }
                : undefined
            }
          />
        )}

        {activeScreen === 'suggestion' && (
          <SuggestionScreen
            currentMeal={currentSuggestedMeal}
            energy={currentEnergy}
            rejectionCount={rejectedMealIds.length}
            maxRejections={3}
            remainingMatches={remainingMatches}
            ignoredRecencyRule={ignoredRecency}
            isEmptyForEnergy={isEmptyForEnergy}
            onCookMeal={handleCookMeal}
            onRejectMeal={handleRejectMeal}
            onLogOrderedFood={handleLogOrderedFood}
            onNavigateToHome={() => setActiveScreen('home')}
            onNavigateToAddMeal={() => setActiveScreen('meals')}
            onResetSession={handleResetSession}
          />
        )}

        {activeScreen === 'meals' && (
          <MealListScreen
            meals={appData.meals}
            onAddMeal={handleAddMeal}
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
            onNavigateToHome={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'summary' && (
          <SummaryScreen
            appData={appData}
            onRestoreData={handleRestoreData}
            onResetSeedList={handleResetSeedList}
            onDeleteLogEntry={handleDeleteLogEntry}
            onNavigateToHome={() => setActiveScreen('home')}
          />
        )}
      </main>

      {/* Instant Notification & Undo Toast */}
      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.onUndo}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
