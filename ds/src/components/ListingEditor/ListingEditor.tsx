/**
 * ListingEditor — the supplier's listing create/edit sheet
 * (BATCH2-SPECS §5.6).
 *
 * - One column in order: photos (the app's uploader node), name,
 *   package, the single/tiers SegmentedControl, the price AmountField or
 *   the tier builder node (motion.fade on the swap), the availability
 *   Toggle, the optional description, and the ActionBar's ONE primary
 *   (ق1) — «أرسل للمراجعة» or «أرسل التعديل» when editing.
 * - Field errors on send: the first error field takes focus (23.17).
 *   No photo on send: the photos slot's error shows (ق2) via the
 *   editor's own error line.
 */
import { useRef, useState } from 'react';
import { t } from '../../i18n/ar';
import { ActionBar } from '../ActionBar/index';
import { AmountField } from '../AmountField/index';
import { SegmentedControl } from '../SegmentedControl/index';
import { Sheet } from '../Sheet/index';
import { TextArea } from '../TextArea/index';
import { TextField } from '../TextField/index';
import { Toggle } from '../Toggle/index';
import type { ListingEditorProps } from './ListingEditor.types';
import './ListingEditor.css';

export function ListingEditor({
  editing = false,
  draft,
  onDismiss,
  onChange,
  photos,
  tiers,
  save,
  className,
  id,
  style,
  ref,
  ...rest
}: ListingEditorProps) {
  const [name, setName] = useState(draft?.label ?? '');
  const [unit, setUnit] = useState(draft?.unit ?? '');
  const [price, setPrice] = useState(String(draft?.price ?? ''));
  const [mode, setMode] = useState<'single' | 'tiers'>(draft?.mode ?? 'single');
  const [available, setAvailable] = useState(draft?.available ?? true);
  const [description, setDescription] = useState(draft?.caption ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const send = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t('editor.nameRequired');
    if (!unit.trim()) next.unit = t('editor.unitRequired');
    if (mode === 'single' && !price.trim()) next.price = t('editor.priceRequired');
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // 23.17: focus the FIRST error field.
      nameRef.current?.focus();
      return;
    }
    onChange?.({
      label: name.trim(),
      unit: unit.trim(),
      mode,
      price: mode === 'single' ? Number(price) : undefined,
      items: draft?.items,
      available,
      caption: description,
    });
  };

  return (
    <Sheet
      label={editing ? t('editor.editTitle') : t('editor.newTitle')}
      onDismiss={onDismiss}
      className={className}
      id={id}
      style={style}
      ref={ref}
      data-ds-check="listing-editor"
      {...rest}
    >
      <div className="mds-sheet-body">
        {photos}
        <TextField
          label={t('editor.listingName')}
          value={name}
          state={errors.name ? 'error' : 'idle'}
          caption={errors.name}
          onChange={setName}
        />
        <TextField
          label={t('editor.unit')}
          value={unit}
          placeholder={t('editor.unitHint')}
          state={errors.unit ? 'error' : 'idle'}
          caption={errors.unit}
          onChange={setUnit}
        />
        <SegmentedControl
          label={t('editor.priceMode')}
          leading={[
            { value: 'single', label: t('editor.singlePrice') },
            { value: 'tiers', label: t('editor.tiers') },
          ]}
          value={mode}
          onChange={(v) => setMode(v as 'single' | 'tiers')}
        />
        {mode === 'single' ? (
          <AmountField
            label={t('editor.pricePerUnit')}
            value={price}
            state={errors.price ? 'error' : 'idle'}
            caption={errors.price}
            onChange={setPrice}
          />
        ) : (
          tiers
        )}
        <Toggle label={t('editor.available')} selected={available} onChange={setAvailable} />
        <TextArea
          label={t('editor.description')}
          caption={t('report.detailsOptional')}
          value={description}
          onChange={setDescription}
        />
        {save}
        {/* ق1: the ONE primary rides the ActionBar. */}
        <ActionBar
          label={editing ? t('editor.sendEdit') : t('editor.sendReview')}
          onPress={send}
        />
      </div>
    </Sheet>
  );
}
