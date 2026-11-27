/**
 * MovementsScreen — «الحركات» (10.2 (3), the finance «الكل» destination): a
 * sub-screen with the back header, the search + filter control row (real),
 * fixed time sections with live sums, and every row at its MovementRow /
 * TransferRow place (batch-2, unbuilt — the internal marker).
 */
import { BackIcon, FilterChips, IconButton, PageHeader, Section, SearchField } from '@micro/ds';
import type { ChipOption } from '@micro/ds';
import { useMemo, useState } from 'react';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, moneyText } from '../parts';
import { pluralAr } from '@micro/ds';
import { dateDisplay } from '../../format';

const TYPE_FILTERS: readonly ChipOption[] = [
  { value: 'in', label: 'داخل' },
  { value: 'out', label: 'خارج' },
  { value: 'transfer', label: 'تحويل' },
];

const COUNTED = { zero: 'لا حركات', one: 'حركة واحدة', two: 'حركتان', few: 'حركات', many: 'حركة' };

export function MovementsScreen() {
  const state = useSim();
  const dispatch = useSimDispatch();
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState<string[]>([]);

  const groups = useMemo(() => {
    const saved = state.movements.filter((m) => m.saved);
    const filtered = saved.filter((m) => {
      if (types.length && !types.includes(m.type)) return false;
      if (query.trim()) {
        const q = query.trim();
        return m.party?.includes(q) || m.note.includes(q) || m.id.includes(q);
      }
      return true;
    });
    const byDate = new Map<string, typeof filtered>();
    for (const m of filtered) {
      const list = byDate.get(m.date) ?? [];
      list.push(m);
      byDate.set(m.date, list);
    }
    return [...byDate.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, list]) => ({ date, list }));
  }, [state.movements, types, query]);

  return (
    <div className="sim-screen" data-sim-screen-body="movements">
      <ContextBarShell />
      <PageHeader
        label="الحركات"
        leading={
          <IconButton
            label="رجوع إلى المالية"
            onPress={() => dispatch({ type: 'ui/navigate', screen: 'finance' })}
          >
            <BackIcon size={24} />
          </IconButton>
        }
      />
      <div className="sim-screen__body">
        <SearchField
          label="ابحث في الحركات"
          placeholder="ابحث في الحركات"
          value={query}
          onChange={setQuery}
        />
        <FilterChips leading={TYPE_FILTERS} value={types} onChange={setTypes} label="نوع الحركة" />
      {groups.length ? (
        groups.map((group) => (
          <Section
            key={group.date}
            label={dateDisplay(group.date) ?? group.date}
            caption={pluralAr(group.list.length, COUNTED)}
          >
            <div className="sim-rows">
              {group.list.map((m) => (
                <div key={m.id} className="sim-later-inline" data-sim-later={m.type === 'transfer' ? 'TransferRow' : 'MovementRow'}>
                  <span className="sim-later__name">يُركَّب لاحقًا: {m.type === 'transfer' ? 'TransferRow' : 'MovementRow'}</span>
                  <span className="sim-later__note">{`${m.id} · ${m.type === 'in' ? 'داخل' : m.type === 'out' ? 'خارج' : 'تحويل'} · ${m.party ?? m.note} · ${moneyText(m.amount)} د`}</span>
                </div>
              ))}
            </div>
          </Section>
        ))
      ) : null}
      </div>
    </div>
  );
}
