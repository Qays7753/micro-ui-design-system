/**
 * App — the simulation shell. SA1 is the DEPLOYMENT PROOF: one screen built
 * from real @micro/ds components (the «مشروع اليوم» shape, addendum §5.1
 * with what exists so far), behind the in-app splash (§9.ب item 2). The full
 * role shell, tabs, sheets and the sim bar arrive with SA6/SA7/SA8.
 */
import { useCallback, useState } from 'react';
import {
  AmountVisibilityProvider,
  Money,
  ObjectRow,
  PageHeader,
  Section,
  StatusBadge,
  Surface,
} from '@micro/ds';
import { Splash } from './splash/Splash';

/** The fixed simulation date (§5): الجمعة 27/11/2026. */
export const SIM_DATE = 'الجمعة 27/11/2026';

export function App() {
  const [splashDone, setSplashDone] = useState(false);
  const onSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <AmountVisibilityProvider>
      <div className="sim-app" data-sim-app={!splashDone ? 'splash' : 'ready'}>
        {!splashDone ? <Splash onDone={onSplashDone} /> : null}
        <main className="sim-screen" aria-label="مشروع اليوم">
          <PageHeader label="مشروع اليوم" />
          <p className="sim-screen__date mds-type-caption"> {SIM_DATE} </p>
          <Section label="يحتاجك" caption={1}>
            <Surface>
              <ObjectRow
                label="سلمى الحوراني"
                caption="فستان سهرة · طلب 1175"
                value={<Money value="45" />}
                trailing={<StatusBadge tone="waiting" label="جاهز" />}
                onPress={() => {}}
              />
            </Surface>
          </Section>
        </main>
      </div>
    </AmountVisibilityProvider>
  );
}
