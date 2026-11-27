/**
 * SimBar (§5.4.1) — with the owner's decisions applied:
 * - NO «ملاحظة» button (decision 3), and the panels are hidden so the
 *   «sliders» button is gone too — BOTH open by a long press on the version
 *   (decision 4).
 * - Above ContextBar, takes the top safe area itself, height size.touch-min,
 *   surface-well background, hairline bottom border, screen margins.
 * Not part of the product: data-sim-bar marks it for tooling.
 */
import { Button } from '@micro/ds';
import type { ReactNode } from 'react';
import { TASKS, taskBarLabel } from '../tasks/tasks';
import { useSim, useSimDispatch } from '../state/store';
import { VersionBadge } from './VersionBadge';

export function SimBar({ onOpenTasks, onOpenPanel }: { onOpenTasks: () => void; onOpenPanel: () => void }) {
  const { tasks, deliveries, role } = useSim();
  const dispatch = useSimDispatch();

  // ر4.4: after the driver sends the issue proposal, the bar carries a
  // «بدّل إلى المالك» button that switches the role WITHOUT a data reset.
  const t344 = tasks.current !== null ? TASKS[tasks.current] : null;
  const showSwitch =
    t344?.id === 'ر4.4' &&
    role === 'driver' &&
    deliveries.find((d) => d.id === 'ت3')?.status === 'failed' &&
    !deliveries.find((d) => d.id === 'ت3')?.issueClosed;

  let trailing: ReactNode = null;
  if (showSwitch) {
    trailing = (
      <Button size="sm" variant="secondary" onPress={() => dispatch({ type: 'role/change', role: 'owner' })}>
        بدّل إلى المالك
      </Button>
    );
  }

  return (
    <div className="sim-bar" data-sim-bar="">
      <VersionBadge onLongPress={onOpenPanel} />
      <button type="button" className="sim-bar__task" onClick={onOpenTasks}>
        {taskBarLabel(TASKS, tasks.current, tasks.statuses)}
      </button>
      {trailing}
    </div>
  );
}
