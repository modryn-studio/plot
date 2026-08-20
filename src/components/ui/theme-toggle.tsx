'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { IconButton } from './icon-button';

/* IconButton, and nothing else. Ported from run-trading@v2, where this file is a single-line
 * consumer of the same primitive: no bespoke border, no bespoke background, no bespoke rest state.
 *
 * This used to carry its own classes (`border-border bg-surface ... border`), which is a real
 * defect and not a style choice: it gave the toggle an always-on ground and edge that IconButton's
 * whole design explicitly avoids for a lone glyph in a rail (see icon-button.tsx). The result was a
 * toggle that looked like an object at rest instead of a bare glyph that raises to a chip on hover
 * and pushes in on press. Every other icon-only control in the app already went through
 * IconButton; this was the one left retyping its own version by hand, and it was the version that
 * drifted.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
