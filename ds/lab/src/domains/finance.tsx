/**
 * finance.tsx — the B1 finance wing of the domains lab (plan B). Every
 * interactive example owns real state (owner note §1). Sections land with
 * their units; B1 ships MovementRow and PaymentProgress so far.
 */
import { useState } from 'react';
import {
  AmountVisibilityProvider, MovementRow, PaymentProgress, Surface,
  ar, t,
} from '@micro/ds';
import type { DomainSection } from './index';

function MovementRowGarden() {
  const [pressed, setPressed] = useState(0);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('movement.in')}</span>
        <Surface>
          <MovementRow label="سلمى الحوراني" caption={`${ar['fund.cashDrawer'].text} · فستان خطوبة`} value="145.750" direction="in" time="12:30 م" onPress={() => setPressed(pressed + 1)} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('movement.out')}</span>
        <Surface>
          <MovementRow label="أبو محمد (بقالة النور)" caption={ar['fund.cashDrawer'].text} value={35} direction="out" time="10:42 صباحاً" onPress={() => setPressed(pressed + 1)} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.draft'].text}</span>
        <Surface>
          <MovementRow label={ar['movement.out'].text + ' · طباعة'} caption={ar['fund.cashDrawer'].text} value={7} direction="out" draft onPress={() => setPressed(pressed + 1)} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <Surface><MovementRow label="…" value={0} direction="in" state="loading" /></Surface>
      </div>
      <p className="lab-label">{pressed > 0 ? `${pressed}` : ''}</p>
    </div>
  );
}

function PaymentProgressGarden() {
  const [paid, setPaid] = useState(35);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <PaymentProgress value={paid} total={80} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.empty')}</span>
        <PaymentProgress value={0} total={80} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['badge.done'].text}</span>
        <PaymentProgress value={80} total={80} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.hidden')}</span>
        <AmountVisibilityProvider hidden><PaymentProgress value={35} total={80} /></AmountVisibilityProvider>
      </div>
      {/* LIVE: a press moves the bar (motion.standard) */}
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['button.recordPayment'].text}</span>
        <button type="button" className="lab-key" onClick={() => setPaid(Math.min(paid + 5, 80))}>{ar['button.recordPayment'].text}</button>
      </div>
    </div>
  );
}

export const financeSections: DomainSection[] = [
  { id: 'movement-row', name: t('lab.h.movementRow'), content: <MovementRowGarden /> },
  { id: 'payment-progress', name: t('lab.h.paymentProgress'), content: <PaymentProgressGarden /> },
];
