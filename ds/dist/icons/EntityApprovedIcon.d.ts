import type { SVGProps } from 'react';
import type { IconSize } from '../tokens/tokens';
export interface EntityApprovedIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height'> {
    /** Icon size in px — BRIEF 5.5 sizes (28 exists for the ask symbol family). */
    size?: IconSize;
    /** Drawing weight — only the weights specified for this icon (BRIEF 23.23). */
    weight?: 'fill';
}
export declare function EntityApprovedIcon({ size, weight, className, ...rest }: EntityApprovedIconProps): import("react").JSX.Element;
