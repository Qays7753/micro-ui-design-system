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
import { AmountVisibilityProvider, AmountVisibilityToggle, Money, StatusBadge, ar, t } from '@micro/ds';
import { amounts, edgeCases } from './data';
import './app.css';

export function App() {
  const [hidden, setHidden] = useState(false);
  const [scale, setScale] = useState<100 | 200>(100);

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
        </main>
      </div>
    </AmountVisibilityProvider>
  );
}
