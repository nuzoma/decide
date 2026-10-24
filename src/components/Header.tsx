import React from 'react';
import { ActiveScreen } from '../types';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  mealCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="w-full bg-[var(--bg-canvas)] transition-colors">
      <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-between border-b border-[var(--border-line)]">
        {/* Minimal Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-base font-semibold tracking-tight text-[var(--text-main)] hover:opacity-80 transition-opacity"
        >
          Meal Decider<span className="font-light text-[var(--text-faint)]">.|</span>
        </button>

        {/* Minimal Text Navigation */}
        <nav className="flex items-center gap-4 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors ${
              activeScreen === 'home'
                ? 'font-semibold text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Decide
          </button>

          <button
            onClick={() => onNavigate('meals')}
            className={`transition-colors ${
              activeScreen === 'meals'
                ? 'font-semibold text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Meals
          </button>

          <button
            onClick={() => onNavigate('summary')}
            className={`transition-colors ${
              activeScreen === 'summary'
                ? 'font-semibold text-[var(--text-main)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            14 Days
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
