/**
 * ScreenRouter — the §5.1 map's runtime: one component per screen key, by
 * the current role. SA7أ–SA7د carry the owner, driver, supplier and
 * reviewer screens; the guest's GuestShell wrap arrives with SA7هـ.
 */
import { useSim } from '../state/store';
import { DriverScreen } from './driver/DriverScreen';
import { SupplierScreen } from './supplier/SupplierScreen';
import { ReviewScreen, ReportsScreen, DriversScreen } from './reviewer/ReviewerScreens';
import { DeliveryScreen } from './owner/DeliveryScreen';
import { FinanceScreen } from './owner/FinanceScreen';
import { MovementsScreen } from './owner/MovementsScreen';
import { OrdersScreen } from './owner/OrdersScreen';
import { TodayScreen } from './owner/TodayScreen';
import { MarketScreen } from './market/MarketScreen';
import { LaterMark } from './parts';

export function ScreenRouter() {
  const { role, ui } = useSim();

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
    case 'review':
      return <ReviewScreen />;
    case 'reports':
      return <ReportsScreen />;
    case 'drivers':
      return <DriversScreen />;
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
