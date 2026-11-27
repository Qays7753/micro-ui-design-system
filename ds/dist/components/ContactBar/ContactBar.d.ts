import type { ContactBarProps } from './ContactBar.types';
import './ContactBar.css';
/** «079 123 4567» → «+962791234567»: strip non-digits, drop the leading
 *  0, prepend the Jordan country code (the brief's only market). */
export declare function toInternational(local: string): string;
export declare function ContactBar({ value, label, density, market, locked, className, id, style, ref, ...rest }: ContactBarProps): import("react").JSX.Element;
