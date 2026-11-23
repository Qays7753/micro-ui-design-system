/**
 * Lab App — one component page per S3 unit (plan S3, K27). So far: unit 1/4,
 * the Money page; unit 2/4, the AmountVisibilityToggle page (the lab's master
 * switch); StatusBadge and EntityMark join with their units.
 *
 * Structure rules the browser gates rely on (do not reorder lightly):
 * - The controls panel comes first, so every <button> sits inside the first
 *   viewport and ds-states can really press it; the two scale keys are the
 *   LAST buttons in DOM order (the 200% key reflows the page).
 * - Sections after the controls carry no interactive elements at all.
 * - The hidden-amounts demo nests its own AmountVisibilityProvider so
 *   `amount-hidden` probes exist at load whatever the master switch does.
 * - A permanently disabled control is never rendered in the lab: ds-states
 *   presses every visible button, and a disabled one shows no :active
 *   feedback by definition (23.24(15)) — the gate exercises the disabled
 *   look by toggling the native property instead.
 * - Only component/state names are shown (K32); all words come from the
 *   package dictionary, lab data comes from ./data (BRIEF 25).
 */
import { useState } from 'react';
import { AmountVisibilityProvider, AmountVisibilityToggle, BackIcon, Button, EntityMark, IconButton, NavTodayIcon, SegmentedControl, TextField, FundBankIcon, FundCashIcon, FundWalletIcon, Money, StatusBadge, ar, t } from '@micro/ds';
import { amounts, drivers, edgeCases, funds, parties } from './data';
import './app.css';

const FUND_ICONS = {
  cash: FundCashIcon,
  bank: FundBankIcon,
  wallet: FundWalletIcon,
} as const;

export function App() {
  const [hidden, setHidden] = useState(false);
  const [scale, setScale] = useState<100 | 200>(100);
  const [segment, setSegment] = useState('today');

  const applyScale = (next: 100 | 200) => {
    setScale(next);
    document.documentElement.style.fontSize = next === 200 ? '200%' : '100%';
  };

  return (
    <AmountVisibilityProvider hidden={hidden}>
      <div className="lab-page">
        <header className="lab-header">
          <p className="lab-stamp">{t('lab.stamp')}</p>
        </header>

        <main className="lab-main">
          {/* ---- Controls: the lab's keys (first in DOM, first viewport) ---- */}
          <section className="lab-section" id="controls">
            <h2 className="lab-title">{t('title.amountToggle')}</h2>
            <div className="lab-row">
              <span className="lab-label">{t('state.default')}</span>
              <AmountVisibilityToggle
                onChange={(visible) => setHidden(!visible)}
                data-ds-check="amount-visibility-toggle"
              />
            </div>
            <div className="lab-row">
              <span className="lab-label">{t('state.driver')}</span>
              <AmountVisibilityToggle density="large" />
            </div>
            <div className="lab-row">
              <span className="lab-label">{t('lab.fontScale')}</span>
              <button
                type="button"
                className={scale === 100 ? 'lab-key lab-key--on' : 'lab-key'}
                onClick={() => applyScale(100)}
              >
                {t('lab.scale100')}
              </button>
              <button
                type="button"
                className={scale === 200 ? 'lab-key lab-key--on' : 'lab-key'}
                onClick={() => applyScale(200)}
              >
                {t('lab.scale200')}
              </button>
            </div>
          </section>

        {/* ---- Money (BRIEF 8 + 23.22): the states of Money.states ---- */}
        <section className="lab-section" id="money">
          <h2 className="lab-title">{t('title.money')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.default')}</span>
            <Money value={amounts[1]} data-ds-check="amount" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.in')}</span>
            <Money value={amounts[0]} direction="in" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.out')}</span>
            <Money value={amounts[7]} direction="out" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.transfer')}</span>
            <Money value={amounts[4]} direction="transfer" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.debt')}</span>
            <Money value={amounts[2]} debt="forYou" data-ds-check="money-md" />
            <Money value={amounts[2]} debt="againstYou" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.hidden')}</span>
            <AmountVisibilityProvider hidden>
              <Money value={amounts[5]} data-ds-check="amount-hidden" />
              <Money value={amounts[2]} debt="forYou" data-ds-check="amount-hidden" />
            </AmountVisibilityProvider>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.missing')}</span>
            <Money value={edgeCases.missingAmount} />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.loading')}</span>
            <Money state="loading" value={amounts[1]} />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.disabled')}</span>
            <Money value={amounts[2]} disabled />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.longest')}</span>
            <Money value={edgeCases.longestAmount} />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.tabular')}</span>
            {/* ds-tabular compares widths pairwise: one size per check id,
                so only the md pair carries the tabular probe. */}
            <Money value="111.111" data-ds-check="tabular" />
            <Money value="888.888" data-ds-check="tabular" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.sizes')}</span>
            <Money value={amounts[3]} size="lg" data-ds-check="money-lg" />
            <Money value="111.111" size="lg" />
            <Money value="888.888" size="lg" />
          </div>
        </section>

        {/* ---- StatusBadge (BRIEF 23.6): the five tones + tight space ---- */}
        <section className="lab-section" id="badge">
          <h2 className="lab-title">{t('title.statusBadge')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.tones')}</span>
            <StatusBadge tone="done" />
            <StatusBadge tone="waiting" />
            <StatusBadge tone="problem" />
            <StatusBadge tone="info" data-ds-check="status-badge-height" />
            <StatusBadge tone="neutral" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('badge.cancelled')}</span>
            <StatusBadge tone="neutral" label={ar['badge.cancelled'].text} />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.longest')}</span>
            <StatusBadge tone="waiting" label={edgeCases.longestName} />
          </div>
        </section>

        {/* ---- EntityMark (BRIEF 23.5 + 23.24(4)) ---- */}
        <section className="lab-section" id="entity">
          <h2 className="lab-title">{t('title.entityMark')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.initial')}</span>
            <EntityMark size="sm" value={parties[0]} data-ds-check="entity-mark-sm" />
            <EntityMark size="md" value={parties[0]} data-ds-check="entity-mark-md" />
            <EntityMark size="lg" value={parties[0]} data-ds-check="entity-mark-lg" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.fundTypes')}</span>
            {funds.map((fund) => {
              const Icon = FUND_ICONS[fund.icon];
              return (
                <span className="lab-entity" key={fund.icon}>
                  <EntityMark size="md">
                    <Icon />
                  </EntityMark>
                  <span className="lab-name">{fund.name}</span>
                </span>
              );
            })}
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.badged')}</span>
            <span className="lab-entity">
              <EntityMark size="md" value={drivers[0]} tone="done" />
              <span className="lab-name">{drivers[0]}</span>
            </span>
            <span className="lab-entity">
              <EntityMark size="md" value={drivers[1]} tone="waiting" />
              <span className="lab-name">{drivers[1]}</span>
            </span>
          </div>
        </section>

        {/* ---- Button (BRIEF 9.3, 23.2, 23.3) ---- */}
        <section className="lab-section" id="button">
          <h2 className="lab-title">{t('title.button')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('variant.primary')}</span>
            <Button data-ds-check="button-md">{t('button.recordMovement')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.secondary')}</span>
            <Button variant="secondary">{t('button.acceptQuote')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.text')}</span>
            <Button variant="text">{t('button.back')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.danger')}</span>
            <Button variant="danger">{t('button.deleteMovement')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.loading')}</span>
            <Button loading>{t('saveState.sending')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.sizes')}</span>
            {/* sm visual is 44 inside a 48 container zone (23.3): the row
                below is the 48 zone, so the instances are ds-exempt with this
                documented reason. */}
            <div className="lab-touch-row">
              <Button size="sm" data-ds-check="button-sm" data-ds-exempt="">
                {t('button.back')}
              </Button>
              <Button size="sm" variant="secondary" data-ds-exempt="">
                {t('button.all')}
              </Button>
            </div>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.withIcon')}</span>
            <Button leading={<BackIcon />}>{t('button.back')}</Button>
          </div>
        </section>

        {/* ---- IconButton (BRIEF 23.2, 23.3): circular 48, named ---- */}
        <section className="lab-section" id="icon-button">
          <h2 className="lab-title">{t('title.iconButton')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.default')}</span>
            <IconButton label={t('button.back')} onPress={() => {}} data-ds-check="icon-button">
              <BackIcon />
            </IconButton>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.driver')}</span>
            <IconButton label={t('button.back')} onPress={() => {}} density="large">
              <BackIcon />
            </IconButton>
          </div>
        </section>

        {/* ---- TextField (BRIEF 9.3, 23.24(10)) ---- */}
        <section className="lab-section" id="text-field">
          <h2 className="lab-title">{t('title.textField')}</h2>
          <div className="lab-row">
            <TextField id="field-supplier" label={t('field.supplier')} data-ds-check="text-field" />
          </div>
          <div className="lab-row">
            <TextField id="field-phone" label={t('field.supplier')} placeholder={t('placeholder.phone')} />
          </div>
          <div className="lab-row">
            <TextField id="field-hint" label={t('field.supplier')} caption={t('help.supplierName')} />
          </div>
          <div className="lab-row">
            <TextField id="field-error" label={t('field.supplier')} state="error" caption={t('error.phoneFormat')} />
          </div>
          <div className="lab-row">
            <TextField id="field-disabled" label={t('field.supplier')} disabled />
          </div>
        </section>

        {/* ---- SegmentedControl (BRIEF 9.1): track, white selected, 2–4 parts ---- */}
        <section className="lab-section" id="segmented-control">
          <h2 className="lab-title">{t('title.segmentedControl')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.twoSegments')}</span>
            <SegmentedControl
              label={t('title.today')}
              leading={[
                { value: 'today', label: t('nav.today') },
                { value: 'agenda', label: t('nav.agenda') },
              ]}
              value={segment}
              onChange={setSegment}
              data-ds-check="segmented-control"
            />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.threeSegments')}</span>
            <SegmentedControl
              label={t('title.today')}
              leading={[
                { value: 'in', label: t('movement.in') },
                { value: 'out', label: t('movement.out') },
                { value: 'transfer', label: t('movement.transfer') },
              ]}
              value="in"
              onChange={() => {}}
            />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.fourSegments')}</span>
            <SegmentedControl
              label={t('title.today')}
              leading={[
                { value: 'in', label: t('movement.in') },
                { value: 'out', label: t('movement.out') },
                { value: 'transfer', label: t('movement.transfer') },
                { value: 'all', label: t('button.all') },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.withIcon')}</span>
            <SegmentedControl
              label={t('title.today')}
              leading={[
                { value: 'today', label: t('nav.today'), leading: <NavTodayIcon /> },
                { value: 'agenda', label: t('nav.agenda') },
              ]}
              value="today"
              onChange={() => {}}
            />
          </div>
        </section>
        </main>
      </div>
    </AmountVisibilityProvider>
  );
}
