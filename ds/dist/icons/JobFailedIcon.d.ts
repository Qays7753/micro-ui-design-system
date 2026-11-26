import type { SVGProps } from 'react';
import type { IconSize } from '../tokens/tokens';
export interface JobFailedIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height'> {
    /** Icon size in px — BRIEF 5.5 sizes (28 exists for the ask symbol family). */
    size?: IconSize;
    /** Drawing weight — only the weights specified for this icon (BRIEF 23.23). */
    weight?: 'regular';
}
export declare function JobFailedIcon({ size, weight, className, ...rest }: JobFailedIconProps): import("react").JSX.Element;
