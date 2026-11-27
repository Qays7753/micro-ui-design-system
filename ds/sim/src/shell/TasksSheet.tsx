/**
 * TasksSheet (§5.4.2) — «الحالية» with the sentence (title-card), the role
 * caption, «ابدأ المهمة»/«أعد المهمة» + «تخطَّ المهمة»; «كل المهام» as
 * Surface rows with the badges أُنجزت/تُخطيت/الحالية (none for untouched).
 * Pressing a row makes it the current one.
 */
import { Button, Section, Sheet, StatusBadge, Surface } from '@micro/ds';
import { useSim, useSimDispatch } from '../state/store';
import { TASKS } from '../tasks/tasks';

const ROLE_NAMES: Record<string, string> = {
  owner: 'المالك',
  driver: 'السائق',
  supplier: 'المورد',
  reviewer: 'المراجع',
  guest: 'الزائر',
};

export function TasksSheet({ onDismiss }: { onDismiss: () => void }) {
  const { tasks } = useSim();
  const dispatch = useSimDispatch();
  const current = tasks.current !== null ? TASKS[tasks.current] : null;
  const currentIdx = tasks.current;
  const started = current !== null && currentIdx !== null ? tasks.statuses[currentIdx] === null && tasks.startedAt !== null : false;

  return (
    <Sheet label="المهام" onDismiss={onDismiss} className="sim-tasks-sheet">
      <div className="sim-tasks-sheet__body">
        <Section label="الحالية">
          {current ? (
            <div className="sim-task-current">
              <p className="sim-task-current__sentence">{current.sentence}</p>
              <p className="sim-task-current__role">الدور: {ROLE_NAMES[current.role] ?? current.role}{current.alsoOwner ? ' ثم المالك' : ''}</p>
              <div className="sim-task-current__actions">
                <Button onPress={() => dispatch({ type: 'task/start', index: currentIdx! })}>
                  {started ? 'أعد المهمة' : 'ابدأ المهمة'}
                </Button>
                <Button variant="text" onPress={() => dispatch({ type: 'task/skip', index: currentIdx! })}>
                  تخطَّ المهمة
                </Button>
              </div>
            </div>
          ) : (
            <p className="sim-task-current__none">لا مهمة حالية.</p>
          )}
        </Section>
        <Section label="كل المهام">
          <Surface>
            {TASKS.map((t, i) => {
              const status = tasks.statuses[i];
              const isCurrent = tasks.current === i;
              return (
                <button
                  type="button"
                  key={t.id}
                  className="sim-task-row"
                  onClick={() => dispatch({ type: 'task/start', index: i })}
                >
                  <span className="sim-task-row__id">{t.id}</span>
                  <span className="sim-task-row__sentence">{t.sentence}</span>
                  {status === 'done' ? (
                    <StatusBadge tone="done" label="أُنجزت" />
                  ) : status === 'skipped' ? (
                    <StatusBadge tone="neutral" label="تُخطيت" />
                  ) : isCurrent ? (
                    <StatusBadge tone="info" label="الحالية" />
                  ) : null}
                </button>
              );
            })}
          </Surface>
        </Section>
      </div>
    </Sheet>
  );
}
