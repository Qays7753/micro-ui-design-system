/**
 * The literal token tree (as const) mirrors tokens.json exactly. CSS values
 * live in tokens.css; this module is the TypeScript view of the same source.
 */
export declare const tokens: {
    readonly color: {
        readonly canvas: "#E8ECEF";
        readonly surface: "#FFFFFF";
        readonly "surface-edge": "#D5DCE0";
        readonly "surface-well": "#F6F8F9";
        readonly "surface-pressed": "#EEF1F3";
        readonly track: "#DDE2E6";
        readonly "text-primary": "#101719";
        readonly "text-secondary": "#5B666C";
        readonly "border-field": "#8A959B";
        readonly "line-table": "#E3E7EA";
        readonly scrim: "rgb(16 23 25 / 40%)";
        readonly "brand-anchor": "#0E3E46";
        readonly "brand-anchor-pressed": "#0A2F35";
        readonly "brand-logo": "#164D59";
        readonly "brand-text": "#0B6A75";
        readonly "brand-data": "#507F8B";
        readonly "brand-selected-bg": "#E6EFF1";
        readonly "brand-selected-pressed": "#D5E4E7";
        readonly "brand-signal": "#D97757";
        readonly "on-anchor": "#FFFFFF";
        readonly "on-anchor-secondary": "#A8C4C9";
        readonly "status-done-fg": "#166B3A";
        readonly "status-done-bg": "#E7F4EA";
        readonly "status-waiting-fg": "#8A5200";
        readonly "status-waiting-bg": "#FFF3D6";
        readonly "status-problem-fg": "#B3261E";
        readonly "status-problem-bg": "#FDECEA";
        readonly "status-info-fg": "#0B6A75";
        readonly "status-info-bg": "#ECFBFB";
        readonly "status-neutral-fg": "#5B666C";
        readonly "status-neutral-bg": "#EEF1F3";
        readonly "disabled-bg": "#DDE2E6";
        readonly "disabled-fg": "#8A959B";
        readonly skeleton: "#E9EDEF";
        readonly "entity-bg": "#DDE2E6";
        readonly "entity-fg": "#3A464C";
        readonly "entity-image-edge": "rgb(16 23 25 / 6%)";
        readonly handle: "#C9D0D4";
        readonly "toast-bg": "#101719";
        readonly "on-dark": "#FFFFFF";
        readonly "on-dark-action": "#8CCFD6";
    };
    readonly role: {
        readonly "focus-ring": "brand-text";
        readonly caret: "brand-text";
        readonly "selection-bg": "brand-selected-bg";
        readonly "field-focus-halo": "brand-selected-bg";
        readonly "dot-unread": "brand-anchor";
        readonly "dot-attention": "status-waiting-fg";
        readonly "chart-zero-line": "border-field";
        readonly "chart-series": "brand-data";
        readonly "chart-highlight": "brand-signal";
        readonly "chart-highlight-negative": "brand-anchor";
        readonly "chart-scrub": "brand-anchor";
        readonly "draft-edge": "brand-signal";
        readonly "today-ring": "brand-signal";
        readonly "now-line": "brand-signal";
        readonly "sparkline-endpoint": "brand-signal";
        readonly "hero-sparkline": "brand-signal";
        readonly "voice-wave": "brand-signal";
        readonly placeholder: "text-secondary";
        readonly "theme-color": "canvas";
    };
    readonly font: {
        readonly display: "'Rubik', 'IBM Plex Sans Arabic', sans-serif";
        readonly text: "'IBM Plex Sans Arabic', sans-serif";
        readonly "display-file": "Rubik[wght].ttf";
        readonly "display-axis": readonly [300, 900];
        readonly "display-weights": readonly [500, 600];
        readonly "display-banned-from-weight": 700;
        readonly "text-weights": readonly [400, 500, 600];
        readonly "display-min-size": 20;
        readonly numeric: "tabular-nums";
        readonly "digit-tracking": "-0.01em";
        readonly "digit-tracking-min-size": 28;
        readonly "arabic-title-min-line-ratio": 1.25;
        readonly "welcome-title-max-ratio-to-wordmark": 0.6;
    };
    readonly type: {
        readonly "display-hero": {
            readonly font: "display";
            readonly size: 40;
            readonly line: 48;
            readonly weight: 500;
        };
        readonly "amount-input": {
            readonly font: "display";
            readonly size: 32;
            readonly line: 40;
            readonly weight: 500;
        };
        readonly "number-lg": {
            readonly font: "display";
            readonly size: 28;
            readonly line: 36;
            readonly weight: 500;
        };
        readonly "title-screen": {
            readonly font: "display";
            readonly size: 28;
            readonly line: 36;
            readonly weight: 600;
        };
        readonly "title-section": {
            readonly font: "display";
            readonly size: 22;
            readonly line: 30;
            readonly weight: 600;
        };
        readonly "title-card": {
            readonly font: "text";
            readonly size: 18;
            readonly line: 26;
            readonly weight: 600;
        };
        readonly body: {
            readonly font: "text";
            readonly size: 16;
            readonly line: 26;
            readonly weight: 400;
        };
        readonly "body-strong": {
            readonly font: "text";
            readonly size: 16;
            readonly line: 24;
            readonly weight: 500;
        };
        readonly "amount-row": {
            readonly font: "text";
            readonly size: 16;
            readonly line: 24;
            readonly weight: 600;
        };
        readonly button: {
            readonly font: "text";
            readonly size: 16;
            readonly line: 24;
            readonly weight: 600;
        };
        readonly label: {
            readonly font: "text";
            readonly size: 14;
            readonly line: 20;
            readonly weight: 500;
        };
        readonly "label-strong": {
            readonly font: "text";
            readonly size: 14;
            readonly line: 20;
            readonly weight: 600;
        };
        readonly caption: {
            readonly font: "text";
            readonly size: 13;
            readonly line: 20;
            readonly weight: 400;
        };
        readonly "caption-strong": {
            readonly font: "text";
            readonly size: 13;
            readonly line: 20;
            readonly weight: 600;
        };
        readonly micro: {
            readonly font: "text";
            readonly size: 12;
            readonly line: 16;
            readonly weight: 600;
        };
        readonly "entity-initial": {
            readonly font: "text";
            readonly weight: 600;
            readonly "size-by-mark": {
                readonly "32": 14;
                readonly "44": 18;
                readonly "64": 26;
            };
        };
    };
    readonly space: readonly [4, 8, 12, 16, 20, 24, 32, 40, 56];
    readonly layout: {
        readonly "screen-margin-phone": 16;
        readonly "screen-margin-tablet": 24;
        readonly "surface-padding-phone": 16;
        readonly "surface-padding-tablet": 20;
        readonly "list-surface-padding-block": 8;
        readonly "row-padding-inline": 16;
        readonly "row-padding-block": 12;
        readonly "row-gap": 12;
        readonly "row-line-gap": 4;
        readonly "hero-padding-phone": 20;
        readonly "hero-padding-tablet": 24;
        readonly "well-padding": 12;
        readonly "tile-padding": 16;
        readonly "sheet-padding": 20;
        readonly "section-title-to-surface": 12;
        readonly "surface-to-surface": 12;
        readonly "section-to-section": 32;
        readonly "label-to-field": 8;
        readonly "field-to-help": 4;
        readonly "field-to-field": 20;
        readonly "group-to-group": 32;
        readonly "tile-gap": 12;
        readonly "toast-offset": 12;
        readonly "toast-padding-block": 12;
        readonly "toast-padding-inline": 16;
        readonly "button-padding": 20;
        readonly "button-compact-padding": 16;
        readonly "button-icon-gap": 8;
        readonly "badge-padding": 8;
        readonly "badge-icon-gap": 4;
        readonly "amount-unit-gap": 4;
        readonly "chip-padding": 16;
        readonly "chip-gap": 8;
        readonly "touch-gap-min": 8;
        readonly "month-grid-margin": 0;
        readonly "action-bar-padding-block": 12;
        readonly "action-bar-gap": 8;
        readonly "segmented-padding": 4;
        readonly "empty-state-gap": 16;
        readonly "empty-state-content-max": 280;
        readonly "pressed-row-inset": 8;
        readonly "scroll-peek-min": 24;
        readonly "scroll-end-padding": 16;
    };
    readonly radius: {
        readonly "2xs": 4;
        readonly xs: 6;
        readonly sm: 8;
        readonly inset: 12;
        readonly md: 16;
        readonly lg: 24;
        readonly "signature-outer": 28;
        readonly xl: 32;
        readonly full: 9999;
        readonly "entity-32": 10;
        readonly "entity-44": 14;
        readonly "entity-64": 20;
        readonly "nested-min": 4;
    };
    readonly border: {
        readonly hairline: 1;
        readonly field: 1;
        readonly "field-focus": 2;
        readonly draft: 2;
        readonly "focus-ring-width": 2;
        readonly "focus-ring-offset": 2;
        readonly "field-focus-halo": 4;
        readonly underline: 1;
        readonly "underline-offset": 3;
        readonly "signal-line": 2;
    };
    readonly elevation: {
        readonly surface: "none";
        readonly float: "0 12px 32px rgb(16 23 25 / 12%)";
    };
    readonly layer: {
        readonly content: 0;
        readonly sticky: 10;
        readonly bars: 20;
        readonly scrim: 30;
        readonly sheet: 40;
        readonly "scrim-2": 50;
        readonly "sheet-2": 60;
        readonly toast: 70;
        readonly "max-stacked-sheets": 2;
    };
    readonly size: {
        readonly "touch-min": 48;
        readonly "touch-driver": 56;
        readonly button: 52;
        readonly "button-compact": 44;
        readonly "button-min-width": 96;
        readonly "icon-button": 48;
        readonly field: 56;
        readonly "amount-field": 72;
        readonly search: 52;
        readonly chip: 40;
        readonly "chip-max-width": 200;
        readonly segmented: 48;
        readonly "segment-min-width": 72;
        readonly "context-bar": 56;
        readonly "tab-bar": 64;
        readonly "row-with-mark": 72;
        readonly "row-plain": 56;
        readonly "dot-signal": 6;
        readonly "row-text-min-width": 96;
        readonly badge: 24;
        readonly "badge-max-width": 160;
        readonly icon: readonly [14, 16, 20, 24];
        readonly entity: readonly [32, 44, 64];
        readonly "ask-symbol": 28;
        readonly "ask-symbol-inline": 16;
        readonly "dot-ask": 6;
        readonly "dot-unread": 8;
        readonly "dot-unread-ring": 2;
        readonly "dot-attention": 8;
        readonly "dot-gallery": 6;
        readonly "tile-height": 152;
        readonly "hero-min-height": 152;
        readonly "horizontal-card-width": 280;
        readonly "handle-width": 36;
        readonly "handle-height": 5;
        readonly "handle-offset": 8;
        readonly "sheet-height": readonly ["50%", "92%"];
        readonly "sheet-tablet-width": 560;
        readonly "toast-tablet-max-width": 480;
        readonly "chart-height": 160;
        readonly "chart-label-height": 20;
        readonly "bar-max-width": 24;
        readonly "bar-width-ratio": 0.6;
        readonly "sparkline-height": 24;
        readonly "chart-area-opacity": 0.08;
        readonly "keypad-key": readonly [64, 56];
        readonly "photo-tile": 96;
        readonly "weekstrip-cell": readonly [44, 56];
        readonly "timeline-hour": 64;
        readonly spinner: 20;
        readonly "spinner-stroke": 2;
        readonly "spinner-arc": 0.75;
        readonly "skeleton-line-body": 12;
        readonly "skeleton-line-caption": 10;
        readonly "skeleton-widths": readonly ["72%", "48%"];
        readonly "skeleton-hero": readonly [160, 32];
        readonly "amount-hidden-glyphs": 4;
        readonly "min-content-width-phone": 328;
        readonly "content-width-phone": readonly [328, 398];
        readonly "lab-viewport": readonly [360, 780];
        readonly "surface-min-width": 320;
        readonly "row-min-width": 288;
        readonly "row-trailing-max-ratio": 0.5;
        readonly "tile-min-width": 158;
        readonly "tile-max-width": 354;
        readonly "textfield-min-width": 160;
        readonly "switcher-min-width": 120;
        readonly "tab-item-max-width": 120;
        readonly "entity-badge": 18;
        readonly "entity-badge-overlap": 4;
        readonly "title-max-lines": 2;
        readonly "toast-max-lines": 2;
        readonly "max-segments": 4;
        readonly "max-wells-per-surface": 2;
    };
    readonly motion: {
        readonly "press-in": {
            readonly ms: 80;
            readonly ease: "ease-out";
            readonly "scale-surface": 0.98;
            readonly "scale-button": 0.96;
        };
        readonly "press-out": {
            readonly ms: 160;
            readonly ease: "cubic-bezier(.2,0,0,1)";
        };
        readonly quick: {
            readonly ms: 160;
            readonly ease: "cubic-bezier(.2,0,0,1)";
        };
        readonly standard: {
            readonly ms: 240;
            readonly ease: "cubic-bezier(.2,0,0,1)";
        };
        readonly emphasized: {
            readonly ms: 360;
            readonly ease: "cubic-bezier(.32,.72,0,1)";
        };
        readonly exit: {
            readonly ms: 200;
            readonly ease: "cubic-bezier(.4,0,1,1)";
        };
        readonly fade: {
            readonly ms: 150;
            readonly "tab-shift": 8;
        };
        readonly count: {
            readonly ms: 400;
            readonly ease: "ease-out";
            readonly "on-first-load": false;
        };
        readonly "check-draw": {
            readonly ms: 300;
            readonly ease: "ease-out";
        };
        readonly growth: {
            readonly ms: 400;
            readonly ease: "ease-out";
            readonly once: true;
        };
        readonly stagger: {
            readonly ms: 20;
            readonly "max-items": 6;
            readonly "only-first-entry": true;
        };
        readonly "ask-think-step": {
            readonly ms: 240;
            readonly pause: 120;
        };
        readonly splash: {
            readonly ms: 600;
        };
        readonly spinner: {
            readonly ms: 800;
            readonly ease: "linear";
        };
        readonly "skeleton-pulse": {
            readonly ms: 1400;
            readonly ease: "ease-in-out";
            readonly from: 1;
            readonly to: 0.55;
            readonly "show-after": 300;
            readonly "min-visible": 500;
        };
        readonly toast: {
            readonly ms: 3000;
            readonly "with-action-ms": 5000;
            readonly "enter-shift": 16;
        };
        readonly "sheet-dismiss": {
            readonly "drag-ratio": 0.3;
            readonly "velocity-px-per-ms": 0.6;
        };
        readonly "press-cancel-px": 8;
        readonly "response-max-ms": 100;
    };
    readonly breakpoint: {
        readonly "phone-min": 360;
        readonly "phone-max": 430;
        readonly "tablet-min": 744;
        readonly "content-max": 720;
    };
    readonly quality: {
        readonly "font-layout-shift-max-px": 2;
        readonly "fps-min": 60;
        readonly "text-scale-max": 2;
        readonly "max-badges-per-screen": 6;
        readonly "max-overview-items": 5;
        readonly "max-tile-facts": 2;
        readonly "max-signal-per-screen": 3;
        readonly "max-signal-per-component": 1;
        readonly "max-hub-sections": 6;
        readonly "max-text-lines": 2;
    };
};
export type Tokens = typeof tokens;
/** Dotted path to any leaf, e.g. 'color.canvas' or 'motion.press-in.ms'. */
export type TokenPath = PathOf<Tokens>;
type PathOf<T, Prefix extends string = ''> = T extends readonly unknown[] ? Prefix : T extends object ? {
    [K in keyof T & string]: PathOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>;
}[keyof T & string] : Prefix;
/** Value type at the end of a TokenPath. */
export type TokenValue<P extends TokenPath> = TokenValueAt<Tokens, P>;
type TokenValueAt<T, P extends string> = P extends `${infer Head}.${infer Rest}` ? Head extends keyof T ? TokenValueAt<T[Head], Rest> : never : P extends keyof T ? T[P] : never;
/** Read a token by dotted path, e.g. getToken('motion.press-cancel-px'). */
export declare function getToken<P extends TokenPath>(path: P): TokenValue<P>;
/** Spacing scale values (BRIEF 7): 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 56. */
export type Space = (typeof tokens.space)[number];
/** Icon sizes (BRIEF 5.5) plus the ask-symbol sizes (tokens.size.ask-symbol). */
export type IconSize = (typeof tokens.size.icon)[number] | (typeof tokens.size)['ask-symbol'];
/** EntityMark sizes (BRIEF 5.4 / 23.5). */
export type EntityMarkSize = (typeof tokens.size.entity)[number];
/**
 * Semantic tone values (BRIEF 23.18). Colors come from tokens
 * (status-*-fg / status-*-bg); the tone union itself is part of the
 * unified property names, not of tokens.json.
 */
export type Tone = 'neutral' | 'info' | 'done' | 'waiting' | 'problem';
/** StatusBadge text kinds -> tone mapping (BRIEF 23.6). */
export type ToneTokenName = 'status-done' | 'status-waiting' | 'status-problem' | 'status-info' | 'status-neutral';
/** SaveState values (BRIEF 23.18). */
export type SaveStateValue = 'draft' | 'sending' | 'saved' | 'failed';
export {};
