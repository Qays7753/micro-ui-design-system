/**
 * SimPanel — لوحة المحاكاة (§5.7): المهام، المحاكاة (six toggles), the
 * hidden identity section (§5.6), التبويبات, الدور, البيانات, and the
 * version footer. Opens by a long press on the version (owner decision 4) —
 * the panel itself carries no product role (data-sim-panel).
 */
import { useState } from 'react';
import { Button, ConfirmSheet, Radio, Section, Sheet, StatusBadge, Surface, Toggle } from '@micro/ds';
import { useSim, useSimDispatch } from '../state/store';
import { tasksProgress } from '../tasks/tasks';
import { setMotionPrefs, useMotionPrefs } from '../motion/motionPrefs';
import { setSimulatedReduced } from '../motion/reducedSim';
import { IdentitySection } from './IdentitySection';
import { VersionBadge } from './VersionBadge';

export function SimPanel({
  onDismiss,
  onOpenTasks,
  onOpenLab,
}: {
  onDismiss: () => void;
  onOpenTasks: () => void;
  onOpenLab: () => void;
}) {
  const { toggles, amountsHidden, tabOrder, tasks, identity } = useSim();
  const motion = useMotionPrefs();
  const dispatch = useSimDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Sheet label="لوحة المحاكاة" onDismiss={onDismiss} className="sim-panel">
        <div className="sim-panel__body">
        <Section label="المهام">
          <Surface>
            <button type="button" className="sim-panel__row" onClick={onOpenTasks}>
              <span>المهام</span>
              <span className="sim-panel__row-end">{tasksProgress(tasks.statuses)}/17</span>
            </button>
          </Surface>
        </Section>

        <Section label="المحاكاة">
          <Surface>
            <Toggle
              label="بلا اتصال"
              selected={toggles.offline}
              onChange={(v) => dispatch({ type: 'toggles/set', patch: { offline: v } })}
            />
            <Toggle
              label="تحميل بطيء"
              selected={toggles.slow}
              onChange={(v) => dispatch({ type: 'toggles/set', patch: { slow: v } })}
            />
            <Toggle
              label="خطأ في الحفظ"
              selected={toggles.saveError}
              onChange={(v) => dispatch({ type: 'toggles/set', patch: { saveError: v } })}
            />
            <Toggle
              label="إخفاء المبالغ"
              selected={amountsHidden}
              onChange={(v) => dispatch({ type: 'amountsHidden/set', hidden: v })}
            />
            <Toggle
              label="وضع السائق"
              selected={toggles.driverMode}
              onChange={(v) => dispatch({ type: 'toggles/set', patch: { driverMode: v } })}
            />
            <Toggle
              label="خط 200%"
              selected={identity.fontScale === 200}
              onChange={(v) => dispatch({ type: 'identity/set', patch: { fontScale: v ? 200 : 100 } })}
            />
          </Surface>
        </Section>

        <Section label="الحركة">
          <Surface>
            <Radio
              label="وضع الحركة (زر المقارنة)"
              value={motion.mode}
              onChange={(v) => setMotionPrefs({ mode: v as 'addendum' | 'off' | 'light' })}
              items={[
                { value: 'addendum', label: 'الملحق' },
                { value: 'off', label: 'بدون' },
                { value: 'light', label: 'خفيف' },
              ]}
            />
            <Toggle
              label="تقليل الحركة"
              selected={motion.reducedSim}
              onChange={(v) => {
                setSimulatedReduced(v);
                setMotionPrefs({ reducedSim: v });
              }}
            />
            <Toggle
              label="إبطاء ×10"
              selected={motion.labScale === 0.1}
              onChange={(v) => setMotionPrefs({ labScale: v ? 0.1 : 1 })}
            />
            <button type="button" className="sim-panel__row" onClick={onOpenLab} data-sim-open-motion-lab>
              <span>مختبر الحركة</span>
              <span className="sim-panel__row-end">ح01–ح40</span>
            </button>
          </Surface>
        </Section>

        <Section label="الهوية">
          <div className="sim-panel__identity">
            <IdentitySection />
          </div>
        </Section>

        <Section label="التبويبات">
          <Radio
            label="ترتيب التبويبات"
            value={tabOrder}
            onChange={(v) => dispatch({ type: 'tabOrder/set', order: v as 'a' | 'b' })}
            items={[
              { value: 'a', label: 'أ: اليوم أولاً' },
              { value: 'b', label: 'ب: مشروع اليوم في الوسط' },
            ]}
          />
        </Section>

        <Section label="الدور">
          <Surface>
            <button type="button" className="sim-panel__row" onClick={() => dispatch({ type: 'role/exit' })}>
              <span>غيّر الدور</span>
              <StatusBadge tone="neutral" label="بلا إعادة بيانات" />
            </button>
          </Surface>
        </Section>

        <Section label="البيانات">
          <Button variant="secondary" mode="canvas" onPress={() => setConfirmOpen(true)}>
            أعد البيانات
          </Button>
        </Section>

          <div className="sim-panel__footer">
            <VersionBadge />
          </div>
        </div>
      </Sheet>
      {/* A sibling, never inside the dragged panel: position:fixed must keep
          the viewport as its containing block (the sheet drags via transform). */}
      {confirmOpen ? (
        <ConfirmSheet
          label="تعيد البيانات للأصل؟"
          caption="تُحذف كل الإدخالات الجديدة."
          value="أعد البيانات"
          onPress={() => {
            setConfirmOpen(false);
            onDismiss();
            dispatch({ type: 'data/reset' });
          }}
          onDismiss={() => setConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}
