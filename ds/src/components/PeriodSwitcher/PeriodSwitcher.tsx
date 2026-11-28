/**
 * PeriodSwitcher.tsx — the period switcher (BATCH2-SPECS §1.27).
 *
 * - ONE control row at size.touch-min, no background (criterion 1: no
 *   other control in the line): «السابق» (back — pointing at the start,
 *   the older side, as the charts word it 9.12), the period label
 *   `label-strong` centered with `expand` 16 at its end, «التالي»
 *   (forward), and — only while the user is OUTSIDE the current period —
 *   the compact secondary jump button «اليوم»/«هذا الأسبوع»/«هذا الشهر»
 *   (criterion 2), which fades in and out (motion.fade). The row has no
 *   background — the button rides the canvas floor, so it takes Button's
 *   canvas mode (ت3: surface fill + hairline edge).
 * - The label is a BUTTON that opens the size sheet — unless `items`
 *   allows exactly ONE size: that is the month-only anatomy the DatePicker
 *   composition rides (ADDENDUM §3.4-2: the label is not a button, no
 *   size sheet).
 * - The size sheet (Sheet 50%): a SegmentedControl (يوم/أسبوع/شهر) whose
 *   press re-anchors the period on the SAME start and closes, and — only
 *   when `items` allows it — the «فترة مخصصة» row that arms the range
 *   mode with its ActionBar «اعرض الفترة» (§1.27-2: it shows in range
 *   mode only). The range grid itself (MonthGrid, range mode) lands in
 *   its own unit and wires in at the DatePicker composition (4.15) — the
 *   same documented interim as DateQuickChips' sheet (kh16).
 * - Screen reader (§1.27-7): the arrows are named «الشهر السابق» /
 *   «الشهر التالي» (the size's word), the label «الفترة: تشرين الثاني
 *   2026، غيّر الفترة», and every change announces the new period's
 *   SPOKEN form («تشرين الأول 2026») through a polite region.
 * - The month shows MM/YYYY and SPEAKS the Levantine name (criterion 3);
 *   the week starts at `weekStart` (criterion 4, م-خ1).
 * - «التالي» disables at `max` (§1.27-4).
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import { BackIcon, ExpandIcon, ForwardIcon } from '../../icons';
import {
  currentPeriod,
  epochDays,
  formatPeriod,
  isSamePeriod,
  normalizePeriod,
  parseDateParts,
  periodEnd,
  startOfToday,
  stepPeriod,
} from '../../lib/format-period';
import { usePress } from '../../lib/use-press';
import { ActionBar } from '../ActionBar/index';
import { Button } from '../Button/index';
import { IconButton } from '../IconButton/index';
import { SegmentedControl } from '../SegmentedControl/index';
import { Sheet } from '../Sheet/index';
import type { PeriodSize, PeriodSwitcherProps, PeriodValue } from './PeriodSwitcher.types';
import './PeriodSwitcher.css';

/** The fixed sizes in their segment order; `custom` is the sheet's own row. */
const FIXED_SIZES: readonly PeriodSize[] = ['day', 'week', 'month'];

export function PeriodSwitcher({
  value,
  items = FIXED_SIZES,
  max,
  weekStart = 0,
  onChange,
  className,
  id,
  style,
  ref,
  ...rest
}: PeriodSwitcherProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const normalized = normalizePeriod(value, weekStart);
  const today = startOfToday();
  const formatted = formatPeriod(normalized, weekStart, today);

  /** «التالي» disables when the next period would pass `max` (§1.27-4). */
  const nextPeriod = stepPeriod(normalized, weekStart, 1);
  const maxDate = parseDateParts(max);
  const nextDisabled =
    maxDate !== undefined && epochDays(periodEnd(nextPeriod)) > epochDays(maxDate);

  /** The jump button: the period of the same size that contains today —
   * a custom range has no defined «الفترة الحالية», so no jump row. */
  const jumpTarget =
    normalized.size === 'day' || normalized.size === 'week' || normalized.size === 'month'
      ? currentPeriod(normalized.size, weekStart, today)
      : undefined;
  const showJump = jumpTarget !== undefined && !isSamePeriod(normalized, jumpTarget);

  const classes = ['mds-period-switcher', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} data-size={normalized.size} {...rest}>
      <IconButton
        label={t(stepWord(normalized.size, -1))}
        onPress={() => onChange?.(stepPeriod(normalized, weekStart, -1))}
      >
        <BackIcon />
      </IconButton>
      {items.length === 1 ? (
        <PeriodLabelStatic text={formatted.text} />
      ) : (
        <PeriodLabelButton
          name={t('period.srName', { spoken: formatted.spoken })}
          text={formatted.text}
          onOpen={() => setSheetOpen(true)}
        />
      )}
      <IconButton
        label={t(stepWord(normalized.size, 1))}
        onPress={() => onChange?.(nextPeriod)}
        disabled={nextDisabled}
      >
        <ForwardIcon size={24} />
      </IconButton>
      {showJump && jumpTarget ? (
        <Button
          variant="secondary"
          mode="canvas"
          size="sm"
          className="mds-period-jump"
          onPress={() => onChange?.(jumpTarget)}
        >
          {t(jumpWord(normalized.size))}
        </Button>
      ) : null}
      {/* §1.27-7: every change announces the period's spoken form politely. */}
      <span className="mds-visually-hidden" aria-live="polite">
        {formatted.spoken}
      </span>
      {sheetOpen && items.length > 1 ? (
        <SizeSheet
          value={normalized}
          items={items}
          weekStart={weekStart}
          onResize={(next) => {
            onChange?.(next);
            setSheetOpen(false);
          }}
          onDismiss={() => setSheetOpen(false)}
        />
      ) : null}
    </div>
  );
}

/** The label in multi-size mode: a real button that opens the size sheet. */
function PeriodLabelButton({
  name,
  text,
  onOpen,
}: {
  name: string;
  text: string;
  onOpen: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen });
  const classes = [
    'mds-period-label',
    'mds-period-label--button',
    isPressed ? 'mds-period-label--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={classes} aria-label={name} {...pressProps}>
      {/* key = the text: the swap remount replays the fade (motion.fade). */}
      <span key={text} className="mds-period-label-text mds-type-label-strong">
        {text}
      </span>
      <ExpandIcon size={16} className="mds-period-label-icon" />
    </button>
  );
}

/** The label in single-size mode: plain text, no button (ADDENDUM §3.4-2). */
function PeriodLabelStatic({ text }: { text: string }) {
  return (
    <span className="mds-period-label">
      <span key={text} className="mds-period-label-text mds-type-label-strong">
        {text}
      </span>
    </span>
  );
}

/** The size sheet (§1.27-2): the size segments and the custom row. */
function SizeSheet({
  value,
  items,
  weekStart,
  onResize,
  onDismiss,
}: {
  value: PeriodValue;
  items: readonly PeriodSize[];
  weekStart: number;
  onResize: (value: PeriodValue) => void;
  onDismiss: () => void;
}) {
  const [customMode, setCustomMode] = useState(false);
  const segments = FIXED_SIZES.filter((size) => items.includes(size)).map((size) => ({
    value: size,
    label: t(sizeWord(size)),
  }));

  return (
    <Sheet label={t('period.sheetTitle')} onDismiss={onDismiss}>
      {segments.length > 1 ? (
        <SegmentedControl
          label={t('period.sizeGroup')}
          leading={segments}
          value={value.size === 'custom' ? '' : value.size}
          onChange={(next) => {
            // The resized period keeps the SAME start (the grid snaps it:
            // a month start becomes its week's start, and so on).
            onResize(normalizePeriod({ size: next as PeriodSize, start: value.start }, weekStart));
          }}
        />
      ) : null}
      {items.includes('custom') ? <CustomRow armed={customMode} onArm={() => setCustomMode(true)} /> : null}
      {/* §1.27-2: the ActionBar exists in RANGE MODE ONLY. The range grid
          itself (MonthGrid range mode) lands in its own unit and wires in
          at the DatePicker composition (4.15) — until then the bar stays
          armed but disabled, exactly as the spec's «يظهر في وضع المدى
          فقط» words it. */}
      {customMode ? <ActionBar label={t('period.apply')} disabled onPress={() => undefined} leading /> : null}
    </Sheet>
  );
}

/** The «فترة مخصصة» row — the range mode's arm (§1.27-2). */
function CustomRow({ armed, onArm }: { armed: boolean; onArm: () => void }) {
  const { isPressed, pressProps } = usePress({ onPress: onArm });
  const classes = [
    'mds-period-custom',
    armed ? 'mds-period-custom--armed' : '',
    isPressed ? 'mds-period-custom--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={classes} aria-pressed={armed} {...pressProps}>
      <span className="mds-period-custom-text mds-type-body-strong">{t('period.custom')}</span>
    </button>
  );
}

/** The size's segment word (§1.27-8: يوم، أسبوع، شهر، فترة مخصصة). */
function sizeWord(size: PeriodSize): ArKey {
  if (size === 'day') return 'period.day';
  if (size === 'week') return 'period.week';
  if (size === 'month') return 'period.month';
  return 'period.custom';
}

/** The arrow's accessible word (§1.27-7: «الشهر السابق»/«الشهر التالي»). */
function stepWord(size: PeriodSize, direction: -1 | 1): ArKey {
  if (size === 'day') return direction === -1 ? 'period.srDayPrev' : 'period.srDayNext';
  if (size === 'week') return direction === -1 ? 'period.srWeekPrev' : 'period.srWeekNext';
  if (size === 'month') return direction === -1 ? 'period.srMonthPrev' : 'period.srMonthNext';
  return direction === -1 ? 'period.srCustomPrev' : 'period.srCustomNext';
}

/** The jump button's word (§1.27-2: «اليوم»/«هذا الأسبوع»/«هذا الشهر»). */
function jumpWord(size: PeriodSize): ArKey {
  if (size === 'week') return 'period.thisWeek';
  if (size === 'month') return 'period.thisMonth';
  return 'period.today';
}
