import type { SVGProps } from 'react';
export interface AskSymbolIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'width' | 'height'> {
    /** 28 = AskButton (size.ask-symbol) · 16 = inline before answers (size.ask-symbol-inline). */
    size?: 16 | 28;
}
export declare function AskSymbolIcon({ size, className, ...rest }: AskSymbolIconProps): import("react").JSX.Element;
