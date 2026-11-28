/**
 * Gallery — the listing detail's photos (BATCH2-SPECS §5.2).
 *
 * - A scroll-snap strip: each photo the container's width at 4:3, r-md;
 *   the dots (23.16) 8 under; a loading photo keeps its well + ratio
 *   then fades in (motion.fade).
 * - ONE photo: no dots, no scroll.
 * - ق1: the dot count equals the photo count. ق2: the first photo is
 *   fully visible at scroll 0 (snap-start).
 * - Screen reader: the region carries roledescription «معرض»; each photo
 *   «صورة 2 من 4، <وصف العرض>»; the prev/next buttons are visually
 *   hidden but present for keyboard users.
 */
import { useEffect, useRef } from 'react';
import { t } from '../../i18n/ar';
import type { GalleryProps } from './Gallery.types';
import './Gallery.css';

export function Gallery({
  items,
  value,
  onChange,
  className,
  id,
  style,
  ref,
  ...rest
}: GalleryProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const current = Math.max(0, Math.min(value ?? 0, items.length - 1));
  const single = items.length <= 1;

  // Keep the strip in sync with the controlled value (and report scroll).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const target = strip.children[current] as HTMLElement | undefined;
    // jsdom has no scrollTo — the guard keeps unit tests honest while
    // browsers keep the smooth snap sync.
    if (target && typeof strip.scrollTo === 'function') {
      strip.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }
  }, [current]);

  const onScroll = () => {
    const strip = stripRef.current;
    if (!strip || !onChange) return;
    const idx = Math.round(strip.scrollLeft / Math.max(strip.clientWidth, 1));
    if (idx !== current && idx >= 0 && idx < items.length) onChange(idx);
  };

  const go = (dir: 1 | -1) => {
    const next = current + dir;
    if (next >= 0 && next < items.length) onChange?.(next);
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="region"
      aria-roledescription={t('sr.galleryRegion')}
      className={['mds-gallery', single ? 'mds-gallery--single' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="gallery"
      {...rest}
    >
      <div className="mds-gallery-strip" ref={stripRef} onScroll={single ? undefined : onScroll}>
        {items.map((item, i) => (
          <div
            className="mds-gallery-item"
            key={`${item.value}-${i}`}
            role="img"
            aria-label={t('gallery.imageOf')
              .replace('{current}', String(i + 1))
              .replace('{total}', String(items.length))
              + (item.caption ? `${t('sr.listSeparator')}${item.caption}` : '')}
          >
            <img className="mds-gallery-photo" src={item.value} alt="" aria-hidden="true" loading="lazy" />
          </div>
        ))}
      </div>
      {!single ? (
        <>
          <div className="mds-gallery-dots" aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={`${item.value}-dot-${i}`}
                className={['mds-gallery-dot', i === current ? 'mds-gallery-dot--active' : '']
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </div>
          <button type="button" className="mds-gallery-nav" onClick={() => go(-1)}>
            {t('gallery.prev')}
          </button>
          <button type="button" className="mds-gallery-nav" onClick={() => go(1)}>
            {t('gallery.next')}
          </button>
        </>
      ) : null}
    </div>
  );
}
