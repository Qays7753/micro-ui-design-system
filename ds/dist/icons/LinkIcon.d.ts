import type { SVGProps } from 'react';
import type { IconSize } from '../tokens/tokens';
export interface LinkIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height'> {
    /** Icon size in px — BRIEF 5.5 sizes (28 exists for the ask symbol family). */
    size?: IconSize;
    /** Drawing weight — only the weights specified for this icon (BRIEF 23.23). */
    weight?: 'regular';
}
export declare function LinkIcon({ size, weight, className, ...rest }: LinkIconProps): import("react").JSX.Element;
