/**
 * RoleScreen — أول شاشة (§5.8): on canvas, no ContextBar/TabBar, the top safe
 * area like the cover (§9.ب 4), NO sim bar. The symbol at 64 centered, then a
 * Surface with the five role rows (title + second line ONLY — no explanation
 * text), «أعد البيانات» with its ConfirmSheet, and the version at the bottom.
 */
import { useState } from 'react';
import {
  Button,
  ConfirmSheet,
  EntityMark,
  NavMarketIcon,
  ObjectRow,
  ReviewIcon,
  Surface,
} from '@micro/ds';
import type { SimRole } from '../data/types';
import { useSimDispatch } from '../state/store';
import type { Screen } from '../state/types';
import { SymbolMark } from './SymbolMark';
import { VersionBadge } from './VersionBadge';

/** §5.8: each role's FIRST screen. */
const FIRST_SCREEN: Record<SimRole, Screen> = {
  owner: 'today',
  driver: 'driverOrders',
  supplier: 'myListings',
  reviewer: 'review',
  guest: 'market',
};

interface RoleRow {
  mark: string;
  name: string;
  role: SimRole;
  roleLabel: string;
  icon?: boolean;
}

const ROWS: readonly RoleRow[] = [
  { mark: 'و', name: 'ورشة الياسمين للخياطة', role: 'owner', roleLabel: 'مالك' },
  { mark: 'ع', name: 'عمر الزعبي', role: 'driver', roleLabel: 'سائق' },
  { mark: 'م', name: 'مخبز الأصيل للجملة', role: 'supplier', roleLabel: 'مورد' },
  { mark: '', name: 'مراجعة المنصة', role: 'reviewer', roleLabel: 'مراجع', icon: true },
  { mark: '', name: 'بلا حساب', role: 'guest', roleLabel: 'زائر', icon: true },
];

export function RoleScreen() {
  const dispatch = useSimDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const enter = (role: SimRole) => {
    dispatch({ type: 'role/enter', role });
    dispatch({ type: 'ui/navigate', screen: FIRST_SCREEN[role] });
  };

  return (
    <div className="sim-role" data-sim-role-screen="">
      <main className="sim-role__body">
        <div className="sim-role__mark">
          <SymbolMark size={64} />
        </div>
        <Surface>
          {ROWS.map((row) => (
            <ObjectRow
              key={row.role}
              label={row.name}
              caption={row.roleLabel}
              leading={
                row.icon ? (
                  row.role === 'reviewer' ? (
                    <ReviewIcon size={24} />
                  ) : (
                    <NavMarketIcon size={24} />
                  )
                ) : (
                  <EntityMark value={row.name} />
                )
              }
              onPress={() => enter(row.role)}
            />
          ))}
        </Surface>
        <Button variant="text" onPress={() => setConfirmOpen(true)}>
          أعد البيانات
        </Button>
      </main>
      <footer className="sim-role__footer">
        <VersionBadge />
      </footer>
      {confirmOpen ? (
        <ConfirmSheet
          label="تعيد البيانات للأصل؟"
          caption="تُحذف كل الإدخالات الجديدة."
          value="أعد البيانات"
          onPress={() => {
            setConfirmOpen(false);
            dispatch({ type: 'data/reset' });
          }}
          onDismiss={() => setConfirmOpen(false)}
        />
      ) : null}
    </div>
  );
}

export function firstScreenOf(role: SimRole): Screen {
  return FIRST_SCREEN[role];
}
