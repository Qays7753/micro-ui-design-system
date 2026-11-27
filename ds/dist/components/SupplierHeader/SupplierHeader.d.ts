import type { SupplierHeaderProps } from './SupplierHeader.types';
import './SupplierHeader.css';
/** 24.1(8) count wording: «عرض واحد» / «عرضان» / «N عروض» / «N عرضاً». */
export declare function offersCountWord(n: number): string;
export declare function SupplierHeader({ label, caption, items, approved, state, className, id, style, ref, ...rest }: SupplierHeaderProps): import("react").JSX.Element;
