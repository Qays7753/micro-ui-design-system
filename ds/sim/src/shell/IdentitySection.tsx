/**
 * IdentitySection — لوحة الهوية الحية (§5.6), the Disclosure «الهوية» inside
 * the sim panel (§5.7 item 3). The Disclosure component itself is a batch-2
 * component still unbuilt on design-system, so its place carries the internal
 * marker and the content stays open (part B folds it into the real
 * Disclosure). Contrast bounds per §5.6, applied live through CSS variables
 * in memory only.
 */
import { useCallback, useState } from 'react';
import { Button, SegmentedControl, TextField, tokens } from '@micro/ds';
import { useSim, useSimDispatch } from '../state/store';

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const v = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => Number.parseInt(v.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const isHex = (v: string): boolean => /^#[0-9a-fA-F]{6}$/.test(v);
const ratioText = (r: number): string => `التباين ${r.toFixed(2).replace(/\.?0+$/, '')}:1`;

interface FieldSpec {
  key: 'brandAnchor' | 'brandText' | 'brandData' | 'brandSignal' | 'canvas';
  label: string;
  varName: string;
  default: string;
  /** (candidate) → null when accepted, or the rejection sentence. */
  reject: (v: string) => string | null;
  /** The live caption under the field. */
  caption: (applied: string) => string;
}

const WHITE = '#FFFFFF';

function fields(canvasDefault: string): FieldSpec[] {
  return [
    {
      key: 'brandAnchor',
      label: 'brand-anchor',
      varName: '--mds-color-brand-anchor',
      default: tokens.color['brand-anchor'],
      reject: (v) => (contrast(WHITE, v) < 4.5 ? 'التباين أقل من 4.5:1 مع الأبيض.' : null),
      caption: (v) => `${ratioText(contrast(WHITE, v))} مع الأبيض`,
    },
    {
      key: 'brandText',
      label: 'brand-text',
      varName: '--mds-color-brand-text',
      default: tokens.color['brand-text'],
      reject: (v) =>
        contrast(WHITE, v) < 4.5 || contrast(canvasDefault, v) < 4.5 ? 'التباين أقل من 4.5:1 مع الأبيض.' : null,
      caption: (v) => `${ratioText(contrast(WHITE, v))} مع الأبيض`,
    },
    {
      key: 'brandData',
      label: 'brand-data',
      varName: '--mds-color-brand-data',
      default: tokens.color['brand-data'],
      reject: (v) => (contrast(WHITE, v) < 3 ? 'التباين أقل من 3:1 مع الأبيض.' : null),
      caption: (v) => `${ratioText(contrast(WHITE, v))} مع الأبيض`,
    },
    {
      key: 'brandSignal',
      label: 'brand-signal',
      varName: '--mds-color-brand-signal',
      default: tokens.color['brand-signal'],
      reject: (v) => (contrast(WHITE, v) < 3 ? 'التباين أقل من 3:1 مع الأبيض.' : null),
      caption: (v) => `${ratioText(contrast(WHITE, v))} مع الأبيض`,
    },
    {
      key: 'canvas',
      label: 'canvas',
      varName: '--mds-color-canvas',
      default: canvasDefault,
      reject: (v) => {
        const r = contrast(WHITE, v);
        if (r < 1.1 || r > 1.3) return 'خارج الحدود المسموحة.';
        if (contrast(tokens.color['text-secondary'], v) < 4.5) return 'خارج الحدود المسموحة.';
        return null;
      },
      caption: (v) => `${ratioText(contrast(WHITE, v))} مع الأبيض`,
    },
  ];
}

export function IdentitySection() {
  const { identity } = useSim();
  const dispatch = useSimDispatch();
  const canvasDefault = identity.canvas ?? tokens.color.canvas;
  const specs = fields(canvasDefault);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const apply = useCallback(
    (spec: FieldSpec, value: string) => {
      if (!isHex(value)) return; // keep typing; validate at 6 digits
      const rejection = spec.reject(value);
      if (rejection === null) {
        dispatch({ type: 'identity/set', patch: { [spec.key]: value } });
      }
    },
    [dispatch],
  );

  return (
    <div className="sim-identity">
      <p className="sim-identity__placeholder" data-sim-later="Disclosure">
        يُركَّب لاحقًا: Disclosure (طيّ «الهوية»)
      </p>
      {specs.map((spec) => {
        const applied = identity[spec.key] ?? spec.default;
        const draft = drafts[spec.key];
        const value = draft ?? applied;
        const rejection = isHex(value) ? spec.reject(value) : null;
        return (
          <TextField
            key={spec.key}
            label={spec.label}
            value={value}
            onChange={(v) => {
              setDrafts((d) => ({ ...d, [spec.key]: v }));
              apply(spec, v);
            }}
            caption={rejection ?? spec.caption(applied)}
            state={rejection ? 'error' : 'idle'}
            dir="ltr"
          />
        );
      })}
      <SegmentedControl
        label="الاستدارة"
        value={String(identity.radiusScale)}
        onChange={(v) => dispatch({ type: 'identity/set', patch: { radiusScale: Number(v) } })}
        leading={[
          { value: '0.5', label: 'أصغر' },
          { value: '1', label: 'الأصل' },
          { value: '1.5', label: 'أكبر' },
        ]}
      />
      <SegmentedControl
        label="الكثافة"
        value={String(identity.densityScale)}
        onChange={(v) => dispatch({ type: 'identity/set', patch: { densityScale: Number(v) } })}
        leading={[
          { value: '0.75', label: 'مضغوطة' },
          { value: '1', label: 'الأصل' },
          { value: '1.25', label: 'مريحة' },
        ]}
      />
      <SegmentedControl
        label="حجم الخط"
        value={String(identity.fontScale)}
        onChange={(v) => dispatch({ type: 'identity/set', patch: { fontScale: Number(v) } })}
        leading={[
          { value: '100', label: '100%' },
          { value: '150', label: '150%' },
          { value: '200', label: '200%' },
        ]}
      />
      <Button
        variant="text"
        onPress={() => {
          setDrafts({});
          dispatch({
            type: 'identity/set',
            patch: {
              brandAnchor: null,
              brandText: null,
              brandData: null,
              brandSignal: null,
              canvas: null,
              radiusScale: 1,
              densityScale: 1,
              fontScale: 100,
            },
          });
        }}
      >
        أعد الهوية الأصلية
      </Button>
    </div>
  );
}
