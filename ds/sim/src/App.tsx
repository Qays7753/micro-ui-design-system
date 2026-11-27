/**
 * App — the simulation shell (SA6): the splash (§9.ب 2) hands over to the
 * first screen; the role picker (§5.8) while no role is chosen, then the
 * app shell — the sim bar (§5.4) above the screen area, with the identity
 * overrides applied live through CSS variables (§5.6) and the amount
 * visibility bound to the store (ر2.4). The screens themselves arrive with
 * SA7; until then the screen area carries the §5.1 map placeholders.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AmountVisibilityProvider, Toast } from '@micro/ds';
import { Splash } from './splash/Splash';
import { SimBar } from './shell/SimBar';
import { SimPanel } from './shell/SimPanel';
import { RoleScreen } from './shell/RoleScreen';
import { TasksSheet } from './shell/TasksSheet';
import { applyRootFontScale, identityStyle } from './shell/identityStyle';
import { SimProvider, useSim, useSimDispatch } from './state/store';
import { TASKS } from './tasks/tasks';

/** The fixed simulation date (§5): الجمعة 27/11/2026. */
export const SIM_DATE = 'الجمعة 27/11/2026';

function Shell() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const [tasksOpen, setTasksOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // §5.6: the font scale rides the root font-size (every type is rem).
  useEffect(() => {
    applyRootFontScale(state.identity.fontScale);
    return () => {
      document.documentElement.style.removeProperty('font-size');
    };
  }, [state.identity.fontScale]);

  // §5.4.2: the success condition is re-checked after every data or screen
  // change; on success the toast fires, then the tasks sheet opens with the
  // next task «الحالية».
  const prevDone = useRef<Set<number>>(new Set());
  useEffect(() => {
    const current = state.tasks.current;
    if (current === null) return;
    const task = TASKS[current];
    if (!task || !task.condition(state)) return;
    if (prevDone.current.has(current)) return;
    prevDone.current.add(current);
    dispatch({ type: 'task/succeed', index: current });
    setToast('أُنجزت المهمة');
  }, [state, dispatch]);

  // «بدّل إلى المالك» moves ر4.4 forward without data changes — the owner
  // sees the issue proposal card on his screen (SA7's اليوم screen).
  const toastTimer = useRef<number | null>(null);
  const tasksCurrent = state.tasks.current;
  useEffect(() => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    if (toast !== null) {
      toastTimer.current = window.setTimeout(() => {
        setToast(null);
        // §5.4.2: after the toast ends, the tasks sheet opens with the next
        // task as «الحالية».
        if (tasksCurrent !== null) setTasksOpen(true);
      }, 3000);
    }
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, [toast, tasksCurrent]);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const openTasks = useCallback(() => setTasksOpen(true), []);
  const closeTasks = useCallback(() => setTasksOpen(false), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  if (state.role === null) {
    return <RoleScreen />;
  }

  return (
    <AmountVisibilityProvider hidden={state.amountsHidden}>
      <div className="sim-app sim-app--shell" style={identityStyle(state.identity)} data-sim-app="ready">
        <SimBar onOpenTasks={openTasks} onOpenPanel={openPanel} />
        <main className="sim-shell-screen" data-sim-screen={state.ui.screen}>
          <p className="sim-shell-placeholder">
            شاشة «{state.ui.screen}» تُبنى في SA7 من مكوّنات المكتبة (§5.1).
          </p>
        </main>
      </div>
      {tasksOpen ? <TasksSheet onDismiss={closeTasks} /> : null}
      {panelOpen ? <SimPanel onDismiss={closePanel} onOpenTasks={openTasks} /> : null}
      {toast !== null ? <Toast label={toast} onDismiss={() => setToast(null)} /> : null}
    </AmountVisibilityProvider>
  );
}

export function App() {
  const [splashDone, setSplashDone] = useState(false);
  const onSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <SimProvider>
      {!splashDone ? <Splash onDone={onSplashDone} /> : null}
      <Shell />
    </SimProvider>
  );
}
