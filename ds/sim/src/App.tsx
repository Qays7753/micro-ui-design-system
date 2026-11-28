/**
 * App — the simulation shell (SA6): the splash (§9.ب 2) hands over to the
 * first screen; the role picker (§5.8) while no role is chosen, then the
 * app shell — the sim bar (§5.4) above the screen area, with the identity
 * overrides applied live through CSS variables (§5.6) and the amount
 * visibility bound to the store (ر2.4). SA7: the screen area carries the
 * §5.1 screens and the shared sheets. PLAN-MOTION: the whole shell lives
 * inside MotionProvider (ت1) — paused from visibilitychange (ت2), profile
 * from وضع السائق (ت3), tier light from the compare switch or the saved
 * measurement (§4.2), scale from مختبر الحركة, and the motion lab page.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AmountVisibilityProvider, Toast } from '@micro/ds';
import { Splash } from './splash/Splash';
import { SimBar } from './shell/SimBar';
import { SimPanel } from './shell/SimPanel';
import { RoleScreen } from './shell/RoleScreen';
import { TasksSheet } from './shell/TasksSheet';
import { applyRootFontScale, identityStyle } from './shell/identityStyle';
import { SimProvider, useSim, useSimDispatch } from './state/store';
import { ScreenRouter } from './screens/ScreenRouter';
import { SharedSheets } from './screens/Sheets';
import { TASKS } from './tasks/tasks';
import { installGhostClickGuard } from './shell/ghostClickGuard';
import { MotionProvider } from './motion/MotionProvider';
import { MotionLab } from './motion/lab/MotionLab';
import { readSavedLight, saveTierLight, setMotionPrefs, useMotionPrefs } from './motion/motionPrefs';
import { installReducedSim } from './motion/reducedSim';

// «تقليل الحركة» المحاكى يعاد توجيه استعلامه قبل أول رسم (main.tsx يستدعيها
// أيضًا — الاستدعاء هنا ضمانة للمسارات البديلة كالاختبارات).
installReducedSim();

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
  const openLab = useCallback(() => {
    setPanelOpen(false);
    setMotionPrefs({ labOpen: true });
  }, []);
  const closeTasks = useCallback(() => setTasksOpen(false), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  if (state.role === null) {
    return <RoleScreen />;
  }

  return (
    <AmountVisibilityProvider hidden={state.amountsHidden}>
      <div
        className="sim-app sim-app--shell"
        style={identityStyle(state.identity)}
        data-sim-app="ready"
        data-sim-font={state.identity.fontScale === 200 ? '200' : undefined}
      >
        <SimBar onOpenTasks={openTasks} onOpenPanel={openPanel} />
        <main className="sim-shell-screen" data-sim-screen={state.ui.screen}>
          <ScreenRouter />
        </main>
      </div>
      <SharedSheets />
      {tasksOpen ? <TasksSheet onDismiss={closeTasks} /> : null}
      {panelOpen ? (
        <SimPanel onDismiss={closePanel} onOpenTasks={openTasks} onOpenLab={openLab} />
      ) : null}
      {toast !== null ? <Toast label={toast} onDismiss={() => setToast(null)} /> : null}
    </AmountVisibilityProvider>
  );
}

/**
 * المزوّد يلف التطبيق كله (ت1) — tier من وضع المقارنة وذكرى القياس المحفوظة
 * للإصدار نفسه (§4.2)، وpaused من visibilitychange وفرض المختبر، وprofile
 * من وضع السائق (ت3)، والسكيل من مختبر الحركة (و«بدون» يوقف كل الحركة
 * عبر html[data-sim-motion] في motion.css فلا يتغير السكيل).
 */
function MotionGate({ children }: { children: ReactNode }) {
  const state = useSim();
  const motion = useMotionPrefs();

  // ت2 — الإيقاف: paused حين document.visibilityState === "hidden".
  const [documentPaused, setDocumentPaused] = useState(false);
  useEffect(() => {
    const update = () => setDocumentPaused(document.visibilityState === 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  // وضع «بدون» يوضع على <html> — مفتاح المقارنة في motion.css.
  useEffect(() => {
    if (motion.mode === 'off') {
      document.documentElement.setAttribute('data-sim-motion', 'off');
      return () => document.documentElement.removeAttribute('data-sim-motion');
    }
    return undefined;
  }, [motion.mode]);

  const tier = motion.mode === 'light' || readSavedLight() ? 'light' : 'auto';
  return (
    <MotionProvider
      tier={tier}
      paused={documentPaused || motion.forcedPaused}
      profile={state.toggles.driverMode ? 'driver' : 'standard'}
      scale={motion.mode === 'off' ? 1 : motion.labScale}
      onTierChange={saveTierLight}
    >
      {children}
      {motion.labOpen ? <MotionLab /> : null}
    </MotionProvider>
  );
}

export function App() {
  const [splashDone, setSplashDone] = useState(false);
  const onSplashDone = useCallback(() => setSplashDone(true), []);

  // TEMPORARY sim-only guard for the touch ghost click that closed every
  // sheet the instant it opened (library Sheet closes its scrim on click
  // while openers fire on pointerup) — see ghostClickGuard.ts and the
  // REPORT-SIM note; removed when the library fixes the scrim.
  useEffect(() => installGhostClickGuard(), []);

  return (
    <SimProvider>
      <MotionGate>
        {!splashDone ? <Splash onDone={onSplashDone} /> : null}
        <Shell />
      </MotionGate>
    </SimProvider>
  );
}
