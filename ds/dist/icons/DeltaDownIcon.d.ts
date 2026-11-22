import type { SVGProps } from 'react';
import type { IconSize } from '../tokens/tokens';
export interface DeltaDownIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height'> {
    /** Icon size in px — BRIEF 5.5 sizes (28 exists for the ask symbol family). */
    size?: IconSize;
    /** Drawing weight — only the weights specified for this icon (BRIEF 23.23). */
    weight?: 'bold';
}
export declare function DeltaDownIcon({ size, weight, className, ...rest }: DeltaDownIconProps): import("react").JSX.Element;
