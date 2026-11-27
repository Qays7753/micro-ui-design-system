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
import { ActionBar, AmountVisibilityProvider, AmountVisibilityToggle, AskButton, AskSymbolIcon, BackIcon, Button, ConfirmSheet, ContextBar, DeltaUpIcon, EmptyState, EntityMark, FilterChips, FundBankIcon, FundCashIcon, FundWalletIcon, HeroSurface, IconButton, InlineBanner, Metric, MetricSmall, Money, NavDeliveryIcon, NavFinanceIcon, NavMarketIcon, NavOrdersIcon, NavTodayIcon, NotificationsButton, ObjectCard, ObjectRow, PageHeader, ProjectSwitcher, RetryIcon, SaveState, Section, SelectedIcon, SegmentedControl, Sheet, Skeleton, StatusBadge, Surface, TabBar, TabBarTab, TextField, Tile, Toast, Well, ar, t } from '@micro/ds';
import { amounts, drivers, edgeCases, funds, parties, projects } from './data';
import './app.css';

const FUND_ICONS = {
  cash: FundCashIcon,
  bank: FundBankIcon,
  wallet: FundWalletIcon,
} as const;

const SECTIONS: { id: string; name: string }[] = [
  { id: 'controls', name: t('title.amountToggle') },
  { id: 'money', name: t('title.money') },
  { id: 'badge', name: t('title.statusBadge') },
  { id: 'entity', name: t('title.entityMark') },
  { id: 'button', name: t('title.button') },
  { id: 'icon-button', name: t('title.iconButton') },
  { id: 'text-field', name: t('title.textField') },
  { id: 'segmented-control', name: t('title.segmentedControl') },
  { id: 'filter-chips', name: t('title.filterChips') },
  { id: 'surface', name: t('title.surface') },
  { id: 'well', name: t('title.well') },
  { id: 'section', name: t('title.section') },
  { id: 'hero', name: t('title.hero') },
  { id: 'sheet', name: t('title.sheet') },
  { id: 'action-bar', name: t('title.actionBar') },
  { id: 'skeleton', name: t('title.skeleton') },
  { id: 'empty-state', name: t('title.emptyState') },
  { id: 'inline-banner', name: t('title.inlineBanner') },
  { id: 'toast', name: t('title.toast') },
  { id: 'save-state', name: t('title.saveState') },
  { id: 'page-header', name: t('title.pageHeader') },
  { id: 'tab-bar', name: t('title.tabBar') },
  { id: 'context-bar', name: t('title.contextBar') },
  { id: 'project-switcher', name: t('title.projectSwitcher') },
  { id: 'notifications-button', name: t('title.notificationsButton') },
  { id: 'ask-button', name: t('title.askButton') },
  { id: 'confirm-sheet', name: t('title.confirmSheet') },
  { id: 'object-row', name: t('title.objectRow') },
  { id: 'object-card', name: t('title.objectCard') },
  { id: 'metric', name: t('title.metric') },
  { id: 'metric-small', name: t('title.metricSmall') },
  { id: 'tile', name: t('title.tile') },
];

export function App() {
  const [hidden, setHidden] = useState(false);
  const [scale, setScale] = useState<100 | 200>(100);
  const [segment, setSegment] = useState('today');
  // 2.1 (owner note §1): EVERY interactive lab example actually works when
  // pressed — no onChange={() => {}} anywhere in the lab or the compose page.
  const [segment3, setSegment3] = useState('in');
  const [segment4, setSegment4] = useState('all');
  const [segmentIcon, setSegmentIcon] = useState('today');

  const [chips, setChips] = useState<string[]>(['in']);
  const [chipsMulti, setChipsMulti] = useState<string[]>(['in', 'transfer']);
  const [chipsScroll, setChipsScroll] = useState<string[]>(['today']);
  const [tab, setTab] = useState(0);
  const [tabDemo, setTabDemo] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 2.1 demo sheets: every pressable in the lab opens its real sample.
  const [projectOpen, setProjectOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState('');
  const [sourceOpen, setSourceOpen] = useState(false);
  const [objectOpen, setObjectOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  // Catalog samples: the exit motion plays on dismiss, THEN the app
  // (here, the lab) removes the sheet — remounted fresh at once so the
  // sample stays for review and the press scan (23.2) keeps hitting it.
  const [sheetSampleKey, setSheetSampleKey] = useState(0);
  // The Toast garden's «تراجع» replays the sample so the press always has a
  // visible effect (the enter motion) — the exit+remount loop of 23.12.
  const [toastUndoKey, setToastUndoKey] = useState(0);
  const [confirmSampleKey, setConfirmSampleKey] = useState(0);
  const [toastText, setToastText] = useState<string | null>(null);
  const [pageState, setPageState] = useState<'normal' | 'loading' | 'empty'>('normal');
  const [view, setView] = useState<'compose' | 'catalog'>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'catalog'
      ? 'catalog'
      : 'compose',
  );

  /* 2.1 demo sheets — the real destinations of every pressable in both
     views: the project switcher sheet (with the 23.22 «إخفاء المبالغ»
     row), the notifications sheet, the Ask panel sample, the amount
     source sheet («كل رقم مجمّع يُظهر مصدره»), the object-sheet pattern
     (10.2 (5)) and the full needs-you list. */
  const demoSheets = (
    <>
      {projectOpen ? (
        <Sheet label={t('sheet.projectTitle')} onDismiss={() => setProjectOpen(false)}>
          <Surface>
            {projects.slice(0, 2).map((name, i) => (
              <ObjectRow
                key={name}
                label={name}
                caption={ar['role.owner'].text}
                trailing={i === 0 ? <SelectedIcon size={20} /> : undefined}
                onPress={() => setProjectOpen(false)}
              />
            ))}
          </Surface>
          <Surface>
            <ObjectRow
              label={hidden ? t('button.showAmounts') : t('button.hideAmounts')}
              trailing={hidden ? <SelectedIcon size={20} /> : undefined}
              onPress={() => { setHidden(!hidden); setProjectOpen(false); }}
            />
          </Surface>
        </Sheet>
      ) : null}
      {notifOpen ? (
        <Sheet label={t('sheet.notificationsTitle')} onDismiss={() => setNotifOpen(false)}>
          <Surface>
            <ObjectRow
              leading={drivers[0]}
              label={t('notif.quoteArrived')}
              caption={t('notif.timeAgo')}
              trailing={<StatusBadge tone="waiting" />}
              onPress={() => setNotifOpen(false)}
            />
            <ObjectRow
              leading={parties[0]}
              label={t('notif.orderToday')}
              caption={t('notif.timeToday')}
              onPress={() => setNotifOpen(false)}
            />
            <ObjectRow
              leading={parties[2]}
              label={t('notif.paymentIn')}
              caption={t('notif.timeYesterday')}
              onPress={() => setNotifOpen(false)}
            />
          </Surface>
        </Sheet>
      ) : null}
      {askOpen ? (
        <Sheet label={t('sheet.askTitle')} onDismiss={() => setAskOpen(false)}>
          <Surface>
            <div className="lab-row-entity" style={{ alignItems: 'center' }}>
              <AskSymbolIcon size={28} />
              <TextField
                label={t('ask.amountLabel')}
                placeholder={t('ask.placeholder')}
                value={askText}
                onChange={setAskText}
              />
            </div>
            <ActionBar
              label={t('button.askSend')}
              onPress={() => { setAskOpen(false); setAskText(''); setToastText(t('toast.questionSent')); }}
              leading={false}
            />
          </Surface>
        </Sheet>
      ) : null}
      {sourceOpen ? (
        <Sheet label={t('sheet.sourceTitle')} onDismiss={() => setSourceOpen(false)}>
          <Surface>
            <ObjectRow label={parties[0]} caption={t('row.sampleCaption')} value={<Money value="145.750" />} trailing={t('row.sampleTime')} onPress={() => setSourceOpen(false)} />
            <ObjectRow label={parties[2]} caption={t('row.sampleCaption')} value={<Money value="90" />} trailing={t('row.sampleTime')} onPress={() => setSourceOpen(false)} />
            <ObjectRow label={parties[3]} caption={t('row.sampleCaption')} value={<Money value="12.500" />} trailing={t('row.sampleTime')} onPress={() => setSourceOpen(false)} />
          </Surface>
        </Sheet>
      ) : null}
      {objectOpen ? (
        <Sheet label={t('sheet.objectTitle')} onDismiss={() => setObjectOpen(false)}>
          <Surface>
            <div className="lab-row-entity">
              <span className="lab-name">{t('kv.orderTitle')}</span>
              <Money value="45" debt="forYou" />
            </div>
            <ObjectRow label={t('kv.customer')} caption={parties[0]} />
            <ObjectRow label={t('kv.delivery')} caption={t('notif.timeToday')} />
            <ObjectRow label={t('kv.phone')} caption={t('placeholder.phone')} />
          </Surface>
          <Surface>
            <ObjectRow
              label={t('button.recordPayment')}
              caption={t('row.sampleCaption')}
              onPress={() => setToastText(t('toast.movementSaved'))}
            />
          </Surface>
        </Sheet>
      ) : null}
      {allOpen ? (
        <Sheet label={t('sheet.allTitle')} onDismiss={() => setAllOpen(false)}>
          <Surface>
            {parties.map((name) => (
              <ObjectRow
                key={name}
                label={name}
                caption={t('row.sampleCaption')}
                value={<Money value="45" />}
                trailing={t('row.sampleTime')}
                onPress={() => setAllOpen(false)}
              />
            ))}
          </Surface>
        </Sheet>
      ) : null}
      {sheetOpen ? (
        <Sheet label={t('sheet.sampleTitle')} onDismiss={() => setSheetOpen(false)}>
          <Surface>
            <TextField id="compose-amount" label={t('field.amount')} placeholder={t('placeholder.amount')} />
            <SaveState saveState="draft" />
            <ActionBar
              label={t('button.saveMovement')}
              onPress={() => {
                setSheetOpen(false);
                setToastText(t('toast.movementSaved'));
              }}
              leading
            />
          </Surface>
        </Sheet>
      ) : null}
      {toastText ? <Toast label={toastText} onDismiss={() => setToastText(null)} /> : null}
    </>
  );

  const applyScale = (next: 100 | 200) => {
    setScale(next);
    document.documentElement.style.fontSize = next === 200 ? '200%' : '100%';
  };

  return (
    <AmountVisibilityProvider hidden={hidden}>
      {view === 'compose' ? (
        <div className="lab-compose">
          <div className="lab-compose-top">
            <Button variant="text" size="sm" data-ds-exempt="view-toggle" onClick={() => setView('catalog')}>{t('button.all')}</Button>
            <AmountVisibilityToggle data-ds-check="amount-visibility-toggle" onChange={(visible) => setHidden(!visible)} />
            <span className="lab-tabular-pair">
              {/* G2 probes riding the lab strip: the money font's tabular
                  figures (ds-tabular), LTR digit runs inside RTL (ds-bidi),
                  and the hidden shape «•••• د» (ds-hidden-amounts). */}
              <Money value="111.111" data-ds-check="tabular" />
              <Money value="888.888" data-ds-check="tabular" />
              <Money value="1,245.750" data-ds-check="bidi" />
              <Money value="888.888" data-ds-check="bidi" />
              <Money value="1,250" data-ds-check="bidi" />
              {/* G2 compose-view measure probes: the page's own REAL elements
                  carry the ds-measure ids (see measure-spec.json views.compose):
                  a default-size Money (money-md), the master visibility toggle,
                  the header's compact Button, and the row's StatusBadge. */}
              <Money value="312.500" data-ds-check="money-md" />
              <AmountVisibilityProvider hidden>
                <Money value="1,245.750" data-ds-check="amount-hidden" />
              </AmountVisibilityProvider>
            </span>
            <button type="button" className={scale === 100 ? 'lab-key lab-key--on' : 'lab-key'} data-ds-exempt="view-toggle" onClick={() => applyScale(100)}>{t('lab.scale100')}</button>
            <button type="button" className={scale === 200 ? 'lab-key lab-key--on' : 'lab-key'} data-ds-exempt="view-toggle" onClick={() => applyScale(200)}>{t('lab.scale200')}</button>
            <button type="button" className={pageState === 'loading' ? 'lab-key lab-key--on' : 'lab-key'} data-ds-exempt="view-toggle" onClick={() => setPageState('loading')}>{t('state.loading')}</button>
            <button type="button" className={pageState === 'empty' ? 'lab-key lab-key--on' : 'lab-key'} data-ds-exempt="view-toggle" onClick={() => setPageState('empty')}>{t('state.empty')}</button>
            <button type="button" className={pageState === 'normal' ? 'lab-key lab-key--on' : 'lab-key'} data-ds-exempt="view-toggle" onClick={() => setPageState('normal')}>{t('state.normal')}</button>
          </div>
          <div className="lab-compose-screen" data-ds-check="compose">
            <ContextBar
              label={t('sr.switchProject')}
              leading={
                <ProjectSwitcher label={projects[0]} caption={ar['role.owner'].text} onPress={() => setProjectOpen(true)} />
              }
              trailing={
                <>
                  <NotificationsButton value={3} onPress={() => setNotifOpen(true)} />
                  <AskButton onPress={() => setAskOpen(true)} />
                </>
              }
            />
            <PageHeader
              label={t('nav.today')}
              trailing={<Button variant="secondary" size="sm" data-ds-check="button-sm" data-ds-exempt="view-toggle" onClick={() => setSheetOpen(true)}>{t('button.recordMovement')}</Button>}
            />
            <div className="lab-compose-content" data-ds-check="compose-content">
              {pageState === 'loading' ? (
                <Surface aria-busy="true">
                  <Skeleton variant="hero" />
                  <div className="lab-skeleton-pair">
                    <Skeleton variant="body" />
                    <Skeleton variant="caption" />
                  </div>
                  <Skeleton variant="mark" />
                </Surface>
              ) : pageState === 'empty' ? (
                <EmptyState label={t('empty.movements')} />
              ) : (
              <>
              <HeroSurface
                label={t('nav.finance')}
                value="1,245.750"
                trailing={t('money.unit')}
                draft={[10.2, 9.8, 11.0, 10.4, 11.6, 11.1, 12.3]}
                direction={
                  /* 23.22 row 2: hidden diff line is arrow + word only —
                      the percent disappears (batch-2 1.3). */
                  <span style={{ color: 'var(--mds-color-on-anchor-secondary)' }}>
                    <DeltaUpIcon />
                    <span>{hidden ? t('metric.deltaHigherHidden') : t('metric.deltaHigher', { percent: '12%' })}</span>
                  </span>
                }
                debt={t('metric.sourceFrom', { counted: t('movement.in') })}
                onDismiss={() => setSourceOpen(true)}
                onChange={(visible) => setHidden(!visible)}
              />
              <Section label={t('title.needsYou')} caption={3} onPress={() => setAllOpen(true)}>
                <Surface>
                  <ObjectRow
                    label={parties[0]}
                    caption={t('row.sampleCaption')}
                    value={<Money value="1,245.750" />}
                    trailing={t('row.sampleTime')}
                    onPress={() => setObjectOpen(true)}
                  />
                  <ObjectRow
                    label={parties[1]}
                    caption={t('row.sampleCaption')}
                    value={<Money value="1,250" />}
                    trailing={<StatusBadge tone="waiting" data-ds-check="status-badge-height" />}
                    data-ds-exempt="view-toggle"
                    onPress={() => setConfirmOpen(true)}
                  />
                </Surface>
              </Section>
              <div className="mds-tile-grid">
                <Tile tone="start" label={t('nav.finance')} leading={<NavFinanceIcon size={20} />} draft={[8.2, 7.6, 8.9, 8.1, 9.4]} value="1,250" trailing={t('movement.in')} onPress={() => setToastText(t('nav.finance'))} />
                <Tile label={t('nav.orders')} leading={<NavOrdersIcon size={20} />} state value="4" trailing={t('badge.waiting')} onPress={() => setToastText(t('nav.orders'))} />
                <Tile label={t('nav.delivery')} leading={<NavDeliveryIcon size={20} />} value="2" trailing={t('movement.out')} onPress={() => setToastText(t('nav.delivery'))} />
                <Tile tone="end" label={t('nav.market')} leading={<NavMarketIcon size={20} />} value="72%" trailing={t('badge.done')} onPress={() => setToastText(t('nav.market'))} />
              </div>
              </>
              )}
            </div>
            {confirmOpen ? (
              <ConfirmSheet
                label={t('confirm.sampleTitle')}
                caption={t('confirm.sampleSentence')}
                value={t('button.deleteMovement')}
                onPress={() => {
                  setConfirmOpen(false);
                  setToastText(t('toast.movementDeleted'));
                }}
                onDismiss={() => setConfirmOpen(false)}
              />
            ) : null}
            {demoSheets}
            <TabBar value={tab} onChange={setTab}>
              <TabBarTab label={ar['nav.todayLong'].text} leading={<NavTodayIcon weight={tab === 0 ? 'fill' : 'regular'} />} onPress={() => setTab(0)} />
              <TabBarTab label={ar['nav.finance'].text} leading={<NavFinanceIcon weight={tab === 1 ? 'fill' : 'regular'} />} onPress={() => setTab(1)} />
              <TabBarTab label={ar['nav.orders'].text} leading={<NavOrdersIcon weight={tab === 2 ? 'fill' : 'regular'} />} onPress={() => setTab(2)} />
              <TabBarTab label={ar['nav.delivery'].text} leading={<NavDeliveryIcon weight={tab === 3 ? 'fill' : 'regular'} />} onPress={() => setTab(3)} />
              <TabBarTab label={ar['nav.market'].text} leading={<NavMarketIcon weight={tab === 4 ? 'fill' : 'regular'} />} onPress={() => setTab(4)} />
            </TabBar>
          </div>
        </div>
      ) : (
      <>
      <div className="lab-page">
        <nav className="lab-index" aria-label={t('lab.index')}>
          <button type="button" className="lab-key" data-ds-exempt="view-toggle" onClick={() => setView('compose')}>{t('button.back')}</button>
          {SECTIONS.map((sec: { id: string; name: string }) => (
            <a key={sec.id} href={`#${sec.id}`}>{sec.name}</a>
          ))}
        </nav>

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
              <AmountVisibilityToggle density="large" onChange={(visible) => setHidden(!visible)} />
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
            <span data-ds-check="bidi"><Money value={amounts[1]} data-ds-check="amount" /></span>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.in')}</span>
            <span data-ds-check="bidi"><Money value={amounts[0]} flow="in" /></span>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.out')}</span>
            <span data-ds-check="bidi"><Money value={amounts[7]} flow="out" /></span>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('movement.transfer')}</span>
            <Money value={amounts[4]} flow="transfer" />
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
            <Button data-ds-check="button-md" onClick={() => setToastText(t('toast.movementSaved'))}>{t('button.recordMovement')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.secondary')}</span>
            <Button variant="secondary" onClick={() => setToastText(t('toast.quoteAccepted'))}>{t('button.acceptQuote')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.text')}</span>
            <Button variant="text" onClick={() => setToastText(t('button.back'))}>{t('button.back')}</Button>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('variant.danger')}</span>
            <Button variant="danger" onClick={() => setToastText(t('toast.movementDeleted'))}>{t('button.deleteMovement')}</Button>
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
              <Button size="sm" data-ds-check="button-sm" data-ds-exempt="" onClick={() => setToastText(t('button.back'))}>
                {t('button.back')}
              </Button>
              <Button size="sm" variant="secondary" data-ds-exempt="" onClick={() => setToastText(t('button.all'))}>
                {t('button.all')}
              </Button>
            </div>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.withIcon')}</span>
            <Button leading={<RetryIcon />} onClick={() => setToastText(t('button.retry'))}>{t('button.retry')}</Button>
          </div>
        </section>

        {/* ---- IconButton (BRIEF 23.2, 23.3): circular 48, named ---- */}
        <section className="lab-section" id="icon-button">
          <h2 className="lab-title">{t('title.iconButton')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.default')}</span>
            <IconButton label={t('button.back')} onPress={() => setToastText(t('button.back'))} data-ds-check="icon-button">
              <BackIcon />
            </IconButton>
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.driver')}</span>
            <IconButton label={t('button.back')} onPress={() => setToastText(t('button.back'))} density="large">
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
          {/* Rule 67 (lesson sweep): optional fields ALONE carry the «اختياري»
              mark after the label, one uniform shape — required never marked. */}
          <div className="lab-row">
            <TextField id="field-optional" label={t('field.supplier')} optional />
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
              value={segment3}
              onChange={setSegment3}
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
              value={segment4}
              onChange={setSegment4}
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
              value={segmentIcon}
              onChange={setSegmentIcon}
            />
          </div>
        </section>

        {/* ---- FilterChips (BRIEF 9.1, 23.16): 40-in-48 chips, horizontal scroll ---- */}
        <section className="lab-section" id="filter-chips">
          <h2 className="lab-title">{t('title.filterChips')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <FilterChips
              label={t('title.filterChips')}
              leading={[
                { value: 'in', label: t('movement.in') },
                { value: 'out', label: t('movement.out') },
                { value: 'transfer', label: t('movement.transfer') },
              ]}
              value={chips}
              onChange={setChips}
              data-ds-check="filter-chips"
            />
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.multiSelect')}</span>
            <FilterChips
              label={t('title.filterChips')}
              leading={[
                { value: 'in', label: t('movement.in') },
                { value: 'out', label: t('movement.out') },
                { value: 'transfer', label: t('movement.transfer') },
                { value: 'all', label: t('button.all') },
              ]}
              value={chipsMulti}
              onChange={setChipsMulti}
            />
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.scrollRow')}</span>
            <FilterChips
              label={t('title.filterChips')}
              leading={[
                { value: 'in', label: t('movement.in') },
                { value: 'out', label: t('movement.out') },
                { value: 'transfer', label: t('movement.transfer') },
                { value: 'all', label: t('button.all') },
                { value: 'today', label: t('nav.todayLong') },
              ]}
              value={chipsScroll}
              onChange={setChipsScroll}
            />
          </div>
        </section>

        {/* ---- Surface (BRIEF 9.2, 23.1(5), 23.21): the primary container ---- */}
        <section className="lab-section" id="surface">
          <h2 className="lab-title">{t('title.surface')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <Surface data-ds-check="surface">
              <div className="lab-row-entity">
                <span className="lab-name">{parties[0]}</span>
                <Money value={amounts[0]} />
              </div>
              <div className="lab-row-entity">
                <span className="lab-name">{parties[1]}</span>
                <Money value={amounts[1]} />
              </div>
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.withHeader')}</span>
            <Surface label={t('title.needsYou')} trailing={<Button variant="text" size="sm" data-ds-exempt="" onClick={() => setToastText(t('button.all'))}>{t('button.all')}</Button>}>
              <div className="lab-row-entity">
                <span className="lab-name">{parties[2]}</span>
                <Money value={amounts[2]} />
              </div>
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.list')}</span>
            <Surface density="list">
              <div className="lab-row-entity">
                <span className="lab-name">{parties[0]}</span>
                <Money value={amounts[0]} />
              </div>
              <div className="lab-row-entity">
                <span className="lab-name">{parties[1]}</span>
                <Money value={amounts[1]} />
              </div>
            </Surface>
          </div>
        </section>

        {/* ---- Well (BRIEF 9.2, 23.1(1)): the inset inside a Surface ---- */}
        <section className="lab-section" id="well">
          <h2 className="lab-title">{t('title.well')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <Surface>
              <Well data-ds-check="well">
                <span className="lab-name">{funds[0].name}</span>
                <Money value={amounts[2]} />
              </Well>
            </Surface>
          </div>
        </section>

        {/* ---- Section (BRIEF 9.2, 23.24(16)): the titled group ---- */}
        <section className="lab-section" id="section">
          <h2 className="lab-title">{t('title.section')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.withCount')}</span>
            <Section label={t('title.needsYou')} caption={3} onPress={() => setAllOpen(true)} data-ds-check="section">
              <Surface>
                <Well>
                  <div className="lab-row-entity">
                    <span className="lab-name">{parties[0]}</span>
                    <Money value={amounts[0]} />
                  </div>
                  <div className="lab-row-entity">
                    <span className="lab-name">{parties[1]}</span>
                    <Money value={amounts[1]} />
                  </div>
                </Well>
              </Surface>
            </Section>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.emptySection')}</span>
            <Section label={t('title.needsYou')} onPress={() => setAllOpen(true)} />
          </div>
        </section>

        {/* ---- HeroSurface (BRIEF 1.5 + 23.8 + 23.25): the screen's single hero ---- */}
        <section className="lab-section" id="hero">
          <h2 className="lab-title">{t('title.hero')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="bidi">
            <span className="lab-label">{t('state.withCents')}</span>
            <HeroSurface
              label={t('nav.finance')}
              value="1,245.750"
              trailing={t('money.unit')}
              direction={
                <>
                  <DeltaUpIcon />
                  {/* 23.22: hidden amounts keep the arrow and the word, no ratio */}
                  <span>{hidden ? t('metric.deltaHigherHidden') : t('metric.deltaHigher', { percent: '12%' })}</span>
                </>
              }
              debt={t('metric.sourceFrom', { counted: t('movement.in') })}
              onDismiss={() => setSourceOpen(true)}
              onChange={(visible) => setHidden(!visible)}
              data-ds-check="hero"
            />
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.withSparkline')}</span>
            <HeroSurface
              label={t('nav.finance')}
              value="1,245.750"
              trailing={t('money.unit')}
              draft={[9.1, 8.4, 9.6, 8.8, 10.1, 9.4, 11.2]}
              direction={
                <>
                  <DeltaUpIcon />
                  {/* 23.22: hidden amounts keep the arrow and the word, no ratio */}
                  <span>{hidden ? t('metric.deltaHigherHidden') : t('metric.deltaHigher', { percent: '12%' })}</span>
                </>
              }
              debt={t('metric.sourceFrom', { counted: t('movement.in') })}
              onDismiss={() => setSourceOpen(true)}
              onChange={(visible) => setHidden(!visible)}
            />
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.longNumber')}</span>
            <HeroSurface
              label={t('nav.finance')}
              value="1,250,000.125"
              trailing={t('money.unit')}
              debt={t('metric.sourceFrom', { counted: t('movement.in') })}
              onDismiss={() => setSourceOpen(true)}
              onChange={(visible) => setHidden(!visible)}
            />
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.emptySection')}</span>
            {/* 2.1: even the empty hero's eye is live — the toggle is the
                GLOBAL 23.22 control, wired through HeroSurface's onChange. */}
            <HeroSurface
              label={t('nav.finance')}
              onChange={(visible) => setHidden(!visible)}
            />
          </div>
        </section>

        {/* ---- Sheet (BRIEF 23.11 + 23.15): the bottom sheet ---- */}
        <section className="lab-section" id="sheet">
          <h2 className="lab-title">{t('title.sheet')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <div className="lab-sheet-stage" data-ds-check="sheet">
              <Sheet key={sheetSampleKey} label={t('sheet.sampleTitle')} onDismiss={() => setSheetSampleKey(k => k + 1)}>
                <Surface label={t('nav.today')} trailing={<Button variant="text" size="sm" data-ds-exempt="" onClick={() => setToastText(t('button.all'))}>{t('button.all')}</Button>}>
                  <ObjectRow
                    label={t('row.sampleTitle')}
                    caption={t('row.sampleCaption')}
                    value="1,245.750"
                    trailing={t('row.sampleTime')}
                    onPress={() => setObjectOpen(true)}
                  />
                  <ObjectRow
                    label={t('row.sampleTitle')}
                    caption={t('row.sampleCaption')}
                    value="980"
                    trailing={<StatusBadge tone="waiting" />}
                    onPress={() => setObjectOpen(true)}
                  />
                </Surface>
              </Sheet>
            </div>
          </div>
        </section>

        {/* ---- ActionBar (BRIEF 9.2 + 23.16 + 27.3/27.4): fixed bottom bar ---- */}
        <section className="lab-section" id="action-bar">
          <h2 className="lab-title">{t('title.actionBar')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.withSecondary')}</span>
            {/* Lab-only presentation (same documented pattern as
                .lab-sheet-stage for the S7 sheets): the FIXED bar would
                swallow every gate press below it on the long lab page, so
                each specimen renders INLINE inside its own mini-frame —
                the component's real fixed+safe-area behavior rides in
                apps. The inline form is position: static via the stage. */}
            <div className="lab-bar-stage" data-ds-check="action-bar">
              <ActionBar
                label={t('button.saveMovement')}
                caption={t('button.recordPayment')}
                onPress={() => setToastText(t('toast.movementSaved'))}
                onRetry={() => setToastText(t('toast.movementSaved'))}
                leading
              />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.primaryOnly')}</span>
            <div className="lab-bar-stage">
              <ActionBar label={t('button.saveMovement')} onPress={() => setToastText(t('toast.movementSaved'))} leading />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.scrolledToEnd')}</span>
            <div className="lab-bar-stage">
              <ActionBar label={t('button.saveMovement')} onPress={() => setToastText(t('toast.movementSaved'))} leading={false} />
            </div>
          </div>
        </section>












        {/* ---- Skeleton (BRIEF 23.10): the real-content shapes on a surface ---- */}
        <section className="lab-section" id="skeleton">
          <h2 className="lab-title">{t('title.skeleton')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="skeleton">
            <span className="lab-label">{t('state.loading')}</span>
            <Surface aria-busy="true">
              <div className="lab-skeleton-pair">
                <Skeleton variant="body" />
                <Skeleton variant="caption" />
              </div>
              <Skeleton variant="hero" />
              <Skeleton variant="mark" />
            </Surface>
          </div>
        </section>

        {/* ---- EmptyState (BRIEF 23.7): the ghost-preview empty surface ---- */}
        <section className="lab-section" id="empty-state">
          <h2 className="lab-title">{t('title.emptyState')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="empty-state">
            <span className="lab-label">{t('state.default')}</span>
            <div className="lab-empty-stage">
              <EmptyState label={t('empty.movements')} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('empty.oneButtonMax')}</span>
            <div className="lab-empty-stage">
              <EmptyState label={t('empty.movements')} trailing={<Button variant="secondary" data-ds-exempt="" onClick={() => setSheetOpen(true)}>{t('button.recordMovement')}</Button>} />
            </div>
          </div>
        </section>

        {/* ---- InlineBanner (BRIEF 517 + 658 + 23.23): the three semantics ---- */}
        <section className="lab-section" id="inline-banner">
          <h2 className="lab-title">{t('title.inlineBanner')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="inline-banner">
            <span className="lab-label">{t('badge.problem')}</span>
            <div className="lab-banner-stage">
              <InlineBanner tone="offline" label={t('banner.offline')} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('badge.neutral')}</span>
            <div className="lab-banner-stage">
              <InlineBanner tone="locked" label={t('banner.permission')} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('button.reviewAndSave')}</span>
            <div className="lab-banner-stage">
              <InlineBanner tone="info" label={t('banner.backOnline')} trailing={<Button variant="secondary" size="sm" data-ds-exempt="" onClick={() => setToastText(t('toast.movementSaved'))}>{t('button.reviewAndSave')}</Button>} />
            </div>
          </div>
        </section>

        {/* ---- Toast (BRIEF 23.12 + 23.17): fixed above the bars ---- */}
        <section className="lab-section" id="toast">
          <h2 className="lab-title">{t('title.toast')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="toast">
            <span className="lab-label">{t('state.default')}</span>
            <div className="lab-toast-stage">
              <Toast label={t('toast.movementSaved')} onDismiss={() => {}} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('button.undo')}</span>
            <div className="lab-toast-stage">
              <Toast key={toastUndoKey} label={t('toast.quoteAccepted')} trailing={<Button variant="text" size="sm" data-ds-exempt="" onClick={() => setToastUndoKey(k => k + 1)}>{t('button.undo')}</Button>} onDismiss={() => {}} />
            </div>
          </div>
        </section>

        {/* ---- SaveState (BRIEF 9.4 + 656 + 23.17): the four save states ---- */}
        <section className="lab-section" id="save-state">
          <h2 className="lab-title">{t('title.saveState')}</h2>
          <div className="lab-row" data-ds-check="save-state">
            <span className="lab-label">{t('state.draft')}</span>
            <SaveState saveState="draft" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.sending')}</span>
            <SaveState saveState="sending" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('badge.done')}</span>
            <SaveState saveState="saved" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('badge.problem')}</span>
            <SaveState saveState="failed" />
          </div>
        </section>

        {/* ---- PageHeader (BRIEF 9.1): the page title, main + sub + collapsed ---- */}
        <section className="lab-section" id="page-header">
          <h2 className="lab-title">{t('title.pageHeader')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.mainScreens')}</span>
            <div className="lab-bar-stage" data-ds-check="page-header">
              <PageHeader label={t('title.movements')} trailing={<Button variant="secondary" size="sm" data-ds-exempt="" onClick={() => setToastText(t('button.new'))}>{t('button.new')}</Button>} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.subScreens')}</span>
            <div className="lab-bar-stage">
              <PageHeader label={t('title.movements')} leading={<IconButton label={t('button.back')} onPress={() => setToastText(t('button.back'))}><BackIcon /></IconButton>} />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.scrolled')}</span>
            <div className="lab-bar-stage">
              <PageHeader label={t('title.movements')} leading={<IconButton label={t('button.back')} onPress={() => setToastText(t('button.back'))}><BackIcon /></IconButton>} caption />
            </div>
          </div>
        </section>

        {/* ---- TabBar (BRIEF 9.1 + 23.16): the bottom tabs ---- */}
        <section className="lab-section" id="tab-bar">
          <h2 className="lab-title">{t('title.tabBar')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.fiveTabs')}</span>
            <div className="lab-bar-stage" data-ds-check="tab-bar">
              <TabBar value={tab} onChange={setTab}>
                <TabBarTab label={ar['nav.todayLong'].text} leading={<NavTodayIcon weight={tab === 0 ? 'fill' : 'regular'} />} onPress={() => setTab(0)} />
                <TabBarTab label={ar['nav.finance'].text} leading={<NavFinanceIcon weight={tab === 1 ? 'fill' : 'regular'} />} onPress={() => setTab(1)} />
                <TabBarTab label={ar['nav.orders'].text} leading={<NavOrdersIcon weight={tab === 2 ? 'fill' : 'regular'} />} onPress={() => setTab(2)} />
                <TabBarTab label={ar['nav.delivery'].text} leading={<NavDeliveryIcon weight={tab === 3 ? 'fill' : 'regular'} />} onPress={() => setTab(3)} />
                <TabBarTab label={ar['nav.market'].text} leading={<NavMarketIcon weight={tab === 4 ? 'fill' : 'regular'} />} onPress={() => setTab(4)} />
              </TabBar>
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <div className="lab-bar-stage">
              <TabBar value={tabDemo} onChange={setTabDemo}>
                <TabBarTab label={ar['nav.today'].text} leading={<NavTodayIcon weight={tabDemo === 0 ? 'fill' : 'regular'} />} onPress={() => setTabDemo(0)} />
                <TabBarTab label={ar['nav.finance'].text} leading={<NavFinanceIcon weight={tabDemo === 1 ? 'fill' : 'regular'} />} onPress={() => setTabDemo(1)} />
              </TabBar>
            </div>
          </div>
        </section>

        {/* ---- ContextBar (BRIEF 9.1 + 23.16): the top bar composing the three ---- */}
        <section className="lab-section" id="context-bar">
          <h2 className="lab-title">{t('title.contextBar')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.mainScreens')}</span>
            <div className="lab-bar-stage" data-ds-check="context-bar">
              <ContextBar
                label={t('sr.switchProject')}
                leading={
                  <ProjectSwitcher
                    label={projects[0]}
                    caption={ar['role.owner'].text}
                    onPress={() => setProjectOpen(true)}
                  />
                }
                trailing={
                  <>
                    <NotificationsButton value={3} onPress={() => setNotifOpen(true)} />
                    <AskButton onPress={() => setAskOpen(true)} />
                  </>
                }
              />
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.subScreens')}</span>
            <div className="lab-bar-stage">
              <ContextBar
                label={t('title.contextBar')}
                leading={
                  <IconButton label={t('sr.back')} onPress={() => setToastText(t('button.back'))}>
                    <BackIcon />
                  </IconButton>
                }
                trailing={
                  <>
                    <NotificationsButton onPress={() => setNotifOpen(true)} />
                    <AskButton selected onPress={() => setAskOpen(true)} />
                  </>
                }
                caption
              />
            </div>
          </div>
        </section>

        {/* ---- ProjectSwitcher (BRIEF 9.1 + 23.20): the project trigger ---- */}
        <section className="lab-section" id="project-switcher">
          <h2 className="lab-title">{t('title.projectSwitcher')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.default')}</span>
            <ProjectSwitcher
              label={projects[0]}
              caption={ar['role.owner'].text}
              onPress={() => setProjectOpen(true)}
              data-ds-check="project-switcher"
            />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.singleRole')}</span>
            <ProjectSwitcher
              label={projects[1]}
              caption={ar['role.owner'].text}
              locked
              onPress={() => setProjectOpen(true)}
            />
          </div>
        </section>

        {/* ---- NotificationsButton (BRIEF 9.1 + 23.24(2)): the bell ---- */}
        <section className="lab-section" id="notifications-button">
          <h2 className="lab-title">{t('title.notificationsButton')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.noUnread')}</span>
            <NotificationsButton onPress={() => setNotifOpen(true)} data-ds-check="notifications-button" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.unread')}</span>
            <NotificationsButton value={3} onPress={() => setNotifOpen(true)} />
          </div>
        </section>

        {/* ---- AskButton (BRIEF 9.1 + 4.2(1) + 23.24(2)): the Ask Micro trigger ---- */}
        <section className="lab-section" id="ask-button">
          <h2 className="lab-title">{t('title.askButton')}</h2>
          <div className="lab-row">
            <span className="lab-label">{t('state.default')}</span>
            <AskButton onPress={() => setAskOpen(true)} data-ds-check="ask-button" />
          </div>
          <div className="lab-row">
            <span className="lab-label">{t('state.unread')}</span>
            <AskButton selected onPress={() => setAskOpen(true)} />
          </div>
        </section>

        {/* ---- ConfirmSheet (BRIEF 9.3 + 23.24): destructive confirm ---- */}
        <section className="lab-section" id="confirm-sheet">
          <h2 className="lab-title">{t('title.confirmSheet')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <div className="lab-sheet-stage" data-ds-check="confirm-sheet">
              <ConfirmSheet
                key={confirmSampleKey}
                label={t('confirm.sampleTitle')}
                caption={t('confirm.sampleSentence')}
                value={t('button.deleteMovement')}
                onPress={() => {
                  setToastText(t('toast.movementDeleted'));
                  setConfirmSampleKey(k => k + 1);
                }}
                onDismiss={() => setConfirmSampleKey(k => k + 1)}
              />
            </div>
          </div>
        </section>

        {/* ---- ObjectRow (BRIEF 23.4): the list row ---- */}
        <section className="lab-section" id="object-row">
          <h2 className="lab-title">{t('title.objectRow')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <Surface>
              <div data-ds-check="object-row">
                <ObjectRow
                  label={t('row.sampleTitle')}
                  caption={t('row.sampleCaption')}
                  value={<Money value="1,245.750" />}
                  trailing={t('row.sampleTime')}
                  onPress={() => setObjectOpen(true)}
                />
                <ObjectRow
                  label={t('row.sampleTitle')}
                  caption={t('row.sampleCaption')}
                  value={<Money value="1,250" />}
                  trailing={<StatusBadge tone="waiting" />}
                  onPress={() => setObjectOpen(true)}
                />
                <ObjectRow label={t('row.sampleTitle')} value="980" onPress={() => setObjectOpen(true)} />
              </div>
            </Surface>
          </div>
        </section>

        {/* ---- ObjectCard (BRIEF 4.1 + 23.24): the card anatomy ---- */}
        <section className="lab-section" id="object-card">
          <h2 className="lab-title">{t('title.objectCard')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.withButton')}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '280px', gap: 12 }}>
              <ObjectCard
                label="طلب 1175 — سلمى الحوراني"
                caption={t('row.sampleCaption')}
                value={<Money value="1,245.750" />}
                state={<StatusBadge tone="waiting" />}
                onPress={() => setObjectOpen(true)}
                data-ds-check="object-card"
              >
                {/* Rule 61 (و-2 item 21): visible text may repeat across
                    instances, the SR name carries the OBJECT — the exact
                    addendum example «سجّل دفعة، سلمى الحوراني». */}
                <Button
                  variant="secondary"
                  size="sm"
                  data-ds-exempt=""
                  aria-label={`${t('button.recordPayment')}، طلب 1175`}
                  onClick={() => setToastText(t('toast.movementSaved'))}
                >
                  {t('button.recordPayment')}
                </Button>
              </ObjectCard>
            </div>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '280px', gap: 12 }}>
              <ObjectCard label="صندوق الكاش" value={<Money value="4,820" />} caption={t('row.sampleTime')} />
            </div>
          </div>
        </section>

        {/* ---- Metric + MetricSmall (BRIEF 9.3 + 23.8 on white) ---- */}
        <section className="lab-section" id="metric">
          <h2 className="lab-title">{t('title.metric')}</h2>
          <div className="lab-row lab-row--full" data-ds-check="bidi">
            <span className="lab-label">{t('state.withCents')}</span>
            <Surface>
              <Metric
                label={t('nav.finance')}
                value="1,245.750"
                trailing={t('money.unit')}
                direction={
                  <span style={{ color: 'var(--mds-color-status-done-fg)' }}>
                    <DeltaUpIcon />
                    <span>{t('metric.deltaHigher', { percent: '12%' })}</span>
                  </span>
                }
                debt={t('metric.sourceFrom', { counted: t('movement.counted') })}
                onDismiss={() => setSourceOpen(true)}
                data-ds-check="metric"
              />
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.loading')}</span>
            <Surface>
              <Metric label={t('nav.finance')} loading />
            </Surface>
          </div>
        </section>
        <section className="lab-section" id="metric-small">
          <h2 className="lab-title">{t('title.metricSmall')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.default')}</span>
            <Surface>
              <MetricSmall
                label={t('nav.finance')}
                value="4,820"
                trailing={t('money.unit')}
                debt={t('metric.sourceFrom', { counted: t('movement.counted') })}
                onDismiss={() => setSourceOpen(true)}
                data-ds-check="metric-small"
              />
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.hidden')}</span>
            <Surface>
              {/* Batch-2 1.3: the metric reads the hidden context itself —
                  its value element carries data-ds-check="amount-hidden"
                  so ds-hidden-amounts verifies «•••• د» on both views. */}
              <AmountVisibilityProvider hidden>
                <MetricSmall
                  label={t('nav.finance')}
                  value="4,820"
                  trailing={t('money.unit')}
                  debt={t('metric.sourceFrom', { counted: t('movement.counted') })}
                  onDismiss={() => setSourceOpen(true)}
                />
              </AmountVisibilityProvider>
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.hidden')}</span>
            <Surface>
              {/* Batch-2 1.3: the metric reads the hidden context itself —
                  its value element carries data-ds-check="amount-hidden"
                  so ds-hidden-amounts verifies «•••• د» on both views. */}
              <AmountVisibilityProvider hidden>
                <MetricSmall
                  label={t('nav.finance')}
                  value="4,820"
                  trailing={t('money.unit')}
                />
              </AmountVisibilityProvider>
            </Surface>
          </div>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.emptySection')}</span>
            <Surface>
              <MetricSmall label={t('nav.finance')} />
            </Surface>
          </div>
        </section>

        {/* ---- Tile (BRIEF 23.9): the 2x2 Bento grid ---- */}
        <section className="lab-section" id="tile">
          <h2 className="lab-title">{t('title.tile')}</h2>
          <div className="lab-row lab-row--full">
            <span className="lab-label">{t('state.grid4')}</span>
            <div className="mds-tile-grid" data-ds-check="tile-grid">
              <Tile
                tone="start"
                label={t('nav.finance')}
                leading={<NavFinanceIcon size={20} />}
                draft={[8.2, 7.6, 8.9, 8.1, 9.4]}
                value="1,250"
                trailing={t('movement.in')}
                onPress={() => setToastText(t('nav.finance'))}
              />
              <Tile
                label={t('nav.orders')}
                leading={<NavOrdersIcon size={20} />}
                state
                value="4"
                trailing={t('badge.waiting')}
                onPress={() => setToastText(t('nav.orders'))}
              />
              <Tile
                label={t('nav.delivery')}
                leading={<NavDeliveryIcon size={20} />}
                value="2"
                trailing={t('movement.out')}
                onPress={() => setToastText(t('nav.delivery'))}
              />
              <Tile
                tone="end"
                label={t('nav.market')}
                leading={<NavMarketIcon size={20} />}
                value="72%"
                trailing={t('badge.done')}
                onPress={() => setToastText(t('nav.market'))}
              />
            </div>
          </div>
        </section>

        </main>
        {demoSheets}
      </div>
      </>
      )}
    </AmountVisibilityProvider>
  );
}
