/**
 * finance.tsx — the B1 finance wing of the domains lab (plan B). Every
 * interactive example owns real state (owner note §1: no onChange={() => {}}).
 * Sections: the six finance components + the finance compose page (§2.7).
 *
 * The compose page builds only what exists on this branch; PeriodSwitcher
 * and the record-movement sheet's stage-4 pieces (MovementTypeControl,
 * AmountKeypad, FundPicker, PartyPicker, DateQuickChips) do NOT exist yet —
 * their places are left and listed in REPORT-B under «يُكمَّل بعد الدمج»
 * (PLAN-B independence rule).
 */
import { useState } from 'react';
import {
  AmountVisibilityProvider, AskButton, Button, ContextBar, DebtCard,
  DebtSummary, FundCard, HeroSurface, Money, MovementRow, NotificationsButton, PageHeader,
  PaymentProgress, ProjectSwitcher, Section, Surface, TabBar, TabBarTab, TransferRow,
  ar, t,
} from '@micro/ds';
import type { DomainSection } from './index';

const CASH = ar['fund.cashDrawer'].text;
const BANK = ar['fund.bankAccount'].text;
const WALLET = ar['fund.walletName'].text;

function MovementRowGarden() {
  const [pressed, setPressed] = useState(0);
  const press = () => setPressed(pressed + 1);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('movement.in')}</span>
        <Surface>
          <MovementRow label="سلمى الحوراني" caption={`${CASH} · فستان خطوبة`} value="145.750" direction="in" time="12:30 م" onPress={press} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('movement.out')}</span>
        <Surface>
          <MovementRow label="أبو محمد (بقالة النور)" caption={CASH} value={35} direction="out" time="10:42 صباحاً" onPress={press} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.draft'].text}</span>
        <Surface>
          <MovementRow label="طباعة" caption={CASH} value={7} direction="out" draft onPress={press} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <Surface><MovementRow label="…" value={0} direction="in" state="loading" /></Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.pressed')} <bdi dir="ltr">{pressed}</bdi></span></div>
    </div>
  );
}

function TransferRowGarden() {
  const [pressed, setPressed] = useState(0);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <Surface>
          <TransferRow from={CASH} to={BANK} value={45} time="أمس 9:15 مساءً" onPress={() => setPressed(pressed + 1)} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['movement.transfer'].text}</span>
        <Surface>
          <TransferRow from={BANK} to={WALLET} caption="تسوية أسبوعية" value="120" onPress={() => setPressed(pressed + 1)} />
        </Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <Surface><TransferRow from="أ" to="ب" value={1} state="loading" /></Surface>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.pressed')} <bdi dir="ltr">{pressed}</bdi></span></div>
    </div>
  );
}

function FundCardGarden() {
  const [opened, setOpened] = useState('');
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.fundTypes')}</span>
        <div className="mds-fund-card-list">
          <FundCard label={CASH} variant="cash" value="1,280" caption={<>{ar['fund.lastMovement'].text} <Money value={85} flow="in" /> · أمس</>} onPress={() => setOpened(CASH)} />
          <FundCard label={BANK} variant="bank" value="12,450.125" caption={<>{ar['fund.lastMovement'].text} <Money value="18.500" flow="out" /> · اليوم</>} onPress={() => setOpened(BANK)} />
          <FundCard label={WALLET} variant="wallet" value={0} caption={<>{ar['fund.lastMovement'].text} <Money value={23} flow="out" /></>} onPress={() => setOpened(WALLET)} />
        </div>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['state.draft'].text}</span>
        <div className="mds-fund-card-list">
          <FundCard label={CASH} variant="cash" value="271.250" caption={<>{ar['fund.lastMovement'].text} <Money value="12.500" flow="in" /> · اليوم</>} draft onPress={() => setOpened(CASH)} />
        </div>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.negativeBalance')}</span>
        <div className="mds-fund-card-list">
          <FundCard label={WALLET} variant="wallet" value={-3} caption={<>{ar['fund.lastMovement'].text} <Money value={3} flow="out" /></>} />
        </div>
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.opened')} {opened}</span></div>
    </div>
  );
}

function DebtCardGarden() {
  const [paid, setPaid] = useState(35);
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['debt.forYou'].text}</span>
        <DebtCard
          label="سلمى الحوراني"
          value={80 - paid}
          debt="owed-to-you"
          caption="يستحق 30/11/2026"
          paid={paid}
          total={80}
          action={<Button variant="secondary" size="sm" onPress={() => setPaid(Math.min(paid + 5, 80))}>{ar['button.recordPayment'].text}</Button>}
        />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['debt.againstYou'].text}</span>
        <DebtCard label="مؤسسة الخطيب للأقمشة" value="1,280" debt="you-owe" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['debt.overdue'].text}</span>
        <DebtCard label="أبو محمد (بقالة النور)" value="12.500" debt="owed-to-you" caption="يستحق 25/11/2026" tone="overdue" paid={0} total="12.500" />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['debt.settled'].text}</span>
        <DebtCard label="رنا العبادي" value={0} debt="owed-to-you" tone="done" />
      </div>
    </div>
  );
}

function DebtSummaryGarden() {
  return (
    <div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.normal')}</span>
        <DebtSummary forYou={{ value: '57.500', counted: 'من عميلين' }} againstYou={{ value: '1,280', counted: 'من مورد واحد' }} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.negativeBalance')}</span>
        <DebtSummary forYou={{ value: '12,450.125', counted: 'من موردين' }} againstYou={{ value: 0, counted: 'لا شيء' }} />
      </div>
      <div className="lab-row lab-row--full"><span className="lab-label">{t('state.loading')}</span>
        <DebtSummary forYou={{ value: 1, counted: 'x' }} againstYou={{ value: 2, counted: 'y' }} state="loading" />
      </div>
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
      <div className="lab-row lab-row--full"><span className="lab-label">{ar['button.recordPayment'].text}</span>
        <button type="button" className="lab-key" onClick={() => setPaid(Math.min(paid + 5, 80))}>{ar['button.recordPayment'].text}</button>
      </div>
    </div>
  );
}

function FinanceCompose() {
  const [paid, setPaid] = useState(35);
  return (
    <div className="lab-compose-screen" data-ds-check="finance-compose">
      <ContextBar
        label={t('sr.switchProject')}
        leading={<ProjectSwitcher label="ورشة الياسمين للخياطة" caption={ar['role.owner'].text} onPress={() => setPaid(paid)} />}
        trailing={<><NotificationsButton value={3} onPress={() => setPaid(paid)} /><AskButton onPress={() => setPaid(paid)} /></>}
      />
      <PageHeader label={t('nav.finance')} />
      {/* PeriodSwitcher (stage 4) غير موجود بعد — موضعه يُكمَّل بعد الدمج */}
      <HeroSurface
        label={t('metric.weekIn')}
        value="294.750"
        trailing={ar['money.unit'].text}
        debt={t('metric.sourceFrom', { counted: '7 حركات' })}
        onDismiss={() => setPaid(paid)}
      />
      {/* AmountVisibilityToggle inside the hero rides the lab master switch
          (23.22): the compose strip carries the real one. */}
      <Section label={t('title.needsYou')} caption={1}>
        <Surface>
          <MovementRow label="طباعة" caption={CASH} value={7} direction="out" draft />
        </Surface>
      </Section>
      <Section label={t('title.funds')} caption={3}>
        <div className="mds-fund-card-list">
          <FundCard label={CASH} variant="cash" value="271.250" caption={<>{ar['fund.lastMovement'].text} <Money value="12.500" flow="in" /> · اليوم</>} draft />
          <FundCard label={BANK} variant="bank" value="327.250" caption={<>{ar['fund.lastMovement'].text} <Money value="18.500" flow="out" /> · اليوم</>} />
          <FundCard label={WALLET} variant="wallet" value={-3} caption={<>{ar['fund.lastMovement'].text} <Money value={3} flow="out" /></>} />
        </div>
      </Section>
      <Section label={t('title.movements')} caption={5}>
        <Surface>
          <MovementRow label="خالد الزعبي" caption={`${CASH} · تفصيل قميص`} value={40} direction="in" time="11:05 ص" />
          <TransferRow from={CASH} to={BANK} value={45} time="أمس 9:15 مساءً" />
          <MovementRow label="مؤسسة الخطيب للأقمشة" caption={`${BANK} · خيوط وإبر`} value="18.500" direction="out" time="12:10 م" />
          <MovementRow label="خالد الزعبي" caption={`${CASH} · تعديل بنطال`} value="12.500" direction="in" time="9:40 ص" />
          <MovementRow label="عمر الزعبي" caption={`${CASH} · توصيل`} value={3} direction="out" time="5:30 م" />
        </Surface>
      </Section>
      <Section label={t('title.debts')}>
        <DebtSummary forYou={{ value: '57.500', counted: 'من عميلين' }} againstYou={{ value: '1,280', counted: 'من مورد واحد' }} />
        <div style={{ display: 'grid', gap: 12, marginTop: 12, maxWidth: '100%' }}>
          <DebtCard
            label="سلمى الحوراني"
            value={80 - paid}
            debt="owed-to-you"
            caption="يستحق 30/11/2026"
            paid={paid}
            total={80}
            action={<Button variant="secondary" size="sm" onPress={() => setPaid(Math.min(paid + 5, 80))}>{ar['button.recordPayment'].text}</Button>}
          />
          <DebtCard label="أبو محمد (بقالة النور)" value="12.500" debt="owed-to-you" caption="يستحق 25/11/2026" tone="overdue" paid={0} total="12.500" />
        </div>
      </Section>
      <TabBar>
        <TabBarTab label={t('nav.today')} onPress={() => undefined} />
        <TabBarTab label={t('nav.orders')} onPress={() => undefined} />
        <TabBarTab label={t('nav.finance')} onPress={() => undefined} />
        <TabBarTab label={t('nav.market')} onPress={() => undefined} />
      </TabBar>
    </div>
  );
}

export const financeSections: DomainSection[] = [
  { id: 'movement-row', name: t('lab.h.movementRow'), content: <MovementRowGarden /> },
  { id: 'transfer-row', name: t('lab.h.transferRow'), content: <TransferRowGarden /> },
  { id: 'fund-card', name: t('lab.h.fundCard'), content: <FundCardGarden /> },
  { id: 'debt-card', name: t('lab.h.debtCard'), content: <DebtCardGarden /> },
  { id: 'debt-summary', name: t('lab.h.debtSummary'), content: <DebtSummaryGarden /> },
  { id: 'payment-progress', name: t('lab.h.paymentProgress'), content: <PaymentProgressGarden /> },
  { id: 'finance-compose', name: t('lab.h.financeCompose'), content: <FinanceCompose /> },
];
