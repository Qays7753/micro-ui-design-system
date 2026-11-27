import { FilterChips, PageHeader, SearchField } from '@micro/ds';
import type { ChipOption } from '@micro/ds';
import { useMemo, useState } from 'react';
import { useSim, useSimDispatch } from '../../state/store';
import { ContextBarShell, OwnerTabBar, moneyText } from '../parts';
import { MARKET_SEARCH } from '../../texts';

/** The market's search + chips + grid (the shared body of every variant). */
export function MarketBody({ locked = false }: { locked?: boolean }) {
  const state = useSim();
  const dispatch = useSimDispatch();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const visible = useMemo(() => {
    const base = state.listings.filter((l) => l.status === 'approved' || l.status === 'approvedWithEdit');
    return base.filter((l) => {
      if (categories.length && !categories.includes(l.category)) return false;
      if (query.trim()) return l.title.includes(query.trim()) || l.supplier.includes(query.trim());
      return true;
    });
  }, [state.listings, categories, query]);

  const categoryOptions: readonly ChipOption[] = useMemo(() => {
    const cats = [
      ...new Set(
        state.listings
          .filter((l) => l.status === 'approved' || l.status === 'approvedWithEdit')
          .map((l) => l.category),
      ),
    ];
    return cats.map((c) => ({ value: c, label: c }));
  }, [state.listings]);

  return (
    <>
      <SearchField label={MARKET_SEARCH} placeholder={MARKET_SEARCH} value={query} onChange={setQuery} />
        {categoryOptions.length > 1 ? (
          <FilterChips leading={categoryOptions} value={categories} onChange={setCategories} label="تصنيفات السوق" />
        ) : null}
        {visible.length ? (
          <div className="sim-market-grid" role="list">
            {visible.map((l) => (
              <button
                key={l.id}
                type="button"
                className="sim-market-cell"
                onClick={() => dispatch({ type: 'ui/openListing', id: l.id })}
              >
                <span className="sim-later sim-later--card" data-sim-later="ListingCard">
                  <span className="sim-later__name">يُركَّب لاحقًا: ListingCard</span>
                  <span className="sim-later__note">{l.title}</span>
                  <span className="sim-later__note">
                    {locked
                      ? 'السعر مقفل — يُركَّب لاحقًا: LockedDetails'
                      : l.tiers
                        ? `من ${moneyText(l.tiers[0]?.price ?? 0)} د / ${l.minOrder}`
                        : l.price !== null
                          ? `${moneyText(l.price)} د / ${l.minOrder}`
                          : '—'}
                    {!locked && l.availability === 'temporarilyUnavailable' ? ' · غير متوفر' : ''}
                  </span>
                  <span className="sim-later__note">{l.supplier}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
    </>
  );
}

/**
 * MarketScreen — «السوق» (م1 §5.8 / 10.2 (8)): the header, the search, the
 * category chips (real, from the listings' own categories), and the two-
 * column grid of ListingCard places — the batch-2 card is still unbuilt, so
 * each visible listing's place carries the internal marker with its live
 * data (title · price · supplier). The owner reaches it as a tab (with the
 * TabBar); the supplier's «السوق» segment and the guest render it without
 * the TabBar (the guest's GuestShell arrives with SA7هـ).
 */
export function MarketScreen({ tab = false }: { tab?: boolean }) {
  return (
    <div className="sim-screen" data-sim-screen-body="market">
      <ContextBarShell />
      <PageHeader label="السوق" />
      <div className="sim-screen__body">
        <MarketBody />
      </div>
      {tab ? <OwnerTabBar /> : null}
    </div>
  );
}
