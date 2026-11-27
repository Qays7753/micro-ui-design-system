import { fireEvent, render, screen } from '@testing-library/react';

/** A press = pointerdown+up (use-press) and click (onClick buttons). */
const press = (el: Element) => {
  fireEvent.pointerDown(el, { button: 0, pointerType: 'touch', pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerUp(el, { button: 0, pointerType: 'touch', pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.click(el, { button: 0 });
};
import { describe, expect, it, vi } from 'vitest';
import { ar } from '../../i18n/ar';
import { ReportSheet } from './ReportSheet';

const REASONS = ['محتوى مضلل', 'سعر غير صحيح', 'منتج مقلد'];

describe('ReportSheet (BATCH2-SPECS §5.5)', () => {
  it('renders every reason as a radio row', () => {
    render(<ReportSheet items={REASONS} onDismiss={() => {}} />);
    const group = screen.getByRole('radiogroup');
    expect(group.querySelectorAll('[role="radio"]').length).toBe(3);
    expect(screen.getByText('سعر غير صحيح')).not.toBeNull();
  });

  it('ONE reason at most (ق1): choosing marks the new one only', () => {
    render(<ReportSheet items={REASONS} onDismiss={() => {}} />);
    const radios = screen.getAllByRole('radio');
    press(radios[0]);
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    press(radios[1]);
    const after = screen.getAllByRole('radio');
    expect(after[0].getAttribute('aria-checked')).toBe('false');
    expect(after[1].getAttribute('aria-checked')).toBe('true');
  });

  it('sending with no reason shows the error line', () => {
    render(<ReportSheet items={REASONS} onDismiss={() => {}} />);
    press(screen.getByRole('button', { name: ar['report.send'].text }));
    expect(screen.getByRole('alert').textContent).toBe(ar['report.chooseReason'].text);
  });

  it('sending with a reason fires onChange(reason, details)', () => {
    const onChange = vi.fn();
    render(<ReportSheet items={REASONS} onDismiss={() => {}} onChange={onChange} />);
    press(screen.getAllByRole('radio')[2]);
    press(screen.getByRole('button', { name: ar['report.send'].text }));
    expect(onChange).toHaveBeenCalledWith(2, '');
  });
});
