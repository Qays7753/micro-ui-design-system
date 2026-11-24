/**
 * Well — the inset container inside a Surface (BRIEF 9.2).
 *
 * - Radius 8: the nested radius rule (23.1(1)) — the Surface's 24 minus
 *   its 16 padding; padding 12; background surface-well.
 * - Lives inside a Surface only (9.2) and holds quiet content — text,
 *   KeyValueList, Money, a text link (23.21). No borders, no shadow, no
 *   interaction: separation comes from the fill alone.
 */
import type { WellProps } from './Well.types';
import './Well.css';

export function Well({ children, className, id, style, ref, ...rest }: WellProps) {
  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-well', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
