/**
 * ScreenRouter — the §5.1 map's runtime: one component per screen key, by
 * the current role. This unit (SA7أ) carries the OWNER's screens and the
 * shared market; the other roles' screens arrive with their own units
 * (SA7ب السائق، SA7ج المورد، SA7د المراجع، SA7هـ الزائر) and their places
 * carry the unit's own marker until then.
 */
import { useSim } from '../state/store';
import { DriverScreen } from './driver/DriverScreen';
import { SupplierScreen } from './supplier/SupplierScreen';
import { DeliveryScreen } from './owner/DeliveryScreen';
import { FinanceScreen } from './owner/FinanceScreen';
import { MovementsScreen } from './owner/MovementsScreen';
import { OrdersScreen } from './owner/OrdersScreen';
import { TodayScreen } from './owner/TodayScreen';
import { MarketScreen } from './market/MarketScreen';
import { LaterMark } from './parts';

/** The unit markers for the screens not yet built. */
const PART_UNITS: Record<string, string> = {
  review: 'SA7د (المراجع)',
  reports: 'SA7د (المراجع)',
  drivers: 'SA7د (المراجع)',
};

export function ScreenRouter() {
  const { role, ui } = useSim();
  const later = PART_UNITS[ui.screen];

  if (later) {
    return (
      <div className="sim-screen" data-sim-screen-body={ui.screen}>
        <LaterMark name={later} note="هذه الشاشة تُبنى في وحدتها القادمة" />
      </div>
    );
  }

  if (role === 'guest') {
    // The guest's market wrap (GuestShell) arrives with SA7هـ.
    return (
      <div className="sim-screen" data-sim-screen-body="market">
        <LaterMark name="SA7هـ (الزائر)" note="سوق الزائر داخل GuestShell يُبنى في وحدته" />
      </div>
    );
  }

  switch (ui.screen) {
    case 'driverOrders':
    case 'myJobs':
      return <DriverScreen />;
    case 'myListings':
      return <SupplierScreen />;
    case 'market':
      return role === 'supplier' ? <SupplierScreen /> : <MarketScreen tab={role === 'owner'} />;
    case 'today':
      return <TodayScreen />;
    case 'finance':
      return <FinanceScreen />;
    case 'movements':
      return <MovementsScreen />;
    case 'orders':
    case 'ordersCalendar':
      return <OrdersScreen />;
    case 'delivery':
      return <DeliveryScreen />;
    default:
      return null;
  }
}
