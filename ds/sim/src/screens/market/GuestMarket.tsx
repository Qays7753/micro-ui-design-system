/**
 * GuestMarket — the visitor's market (§5.1 الزائر / م1 §5.8 / 10.2 (9)): the
 * GuestShell's place carries its marker (its own top bar — the Arabic lockup
 * and the GoogleSignInSlot's place — with NO TabBar, NO ContextBar and NO
 * AskButton before the login), the shared market body with the prices
 * LOCKED (LockedDetails's place), and after «دخول تجريبي» (the secondary
 * button that rides the slot in part B) the registered buyer's market shows
 * the prices and the bar's end becomes the bell (+ ask).
 */
import { useSim } from '../../state/store';
import { MarketBody } from './MarketScreen';

export function GuestMarket() {
  const state = useSim();
  const buyer = state.buyer;
  return (
    <div className="sim-screen sim-screen--guest" data-sim-screen-body="market">
      <div className="sim-later" data-sim-later="GuestShell">
        <span className="sim-later__name">يُركَّب لاحقًا: GuestShell</span>
        <span className="sim-later__note">
          {buyer
            ? 'دخلت كمشترٍ مسجّل بلا مشروع — نهاية الشريط الجرس وAsk، والأسعار والتواصل ظاهرة'
            : 'الشريط العلوي: الشعار العربي + مكان الدخول، وبلا TabBar ولا AskButton قبل الدخول'}
        </span>
      </div>
      <div className="sim-later-inline" data-sim-later="GoogleSignInSlot">
        <span className="sim-later__name">يُركَّب لاحقًا: GoogleSignInSlot</span>
        <span className="sim-later__note">
          {buyer ? 'دخل الزائر (دخول تجريبي)' : 'داخله زر ثانوي «دخول تجريبي» — ليس زر Google ولا يحاكي شكله (ر5.1)'}
        </span>
      </div>
      <MarketBody locked={!buyer} />
    </div>
  );
}
