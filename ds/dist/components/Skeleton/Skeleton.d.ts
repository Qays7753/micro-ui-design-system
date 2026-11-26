/**
 * Skeleton — the loading placeholder primitive (BRIEF 23.10).
 *
 * Renders the real content's shape in the skeleton color with the
 * 1400ms opacity pulse. aria-hidden + the host marks the loading
 * REGION with aria-busy (23.17: «منطقة تُحمّل: aria-busy على المنطقة،
 * بلا إعلان»).
 */
import type { SkeletonProps } from './Skeleton.types';
import './Skeleton.css';
export declare function Skeleton({ variant, className, id, style, ref, ...rest }: SkeletonProps): import("react").JSX.Element;
