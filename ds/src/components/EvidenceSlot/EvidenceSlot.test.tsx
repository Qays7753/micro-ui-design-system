import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ar } from '../../i18n/ar';
import { EvidenceSlot } from './EvidenceSlot';

describe('EvidenceSlot (BATCH2-SPECS §4.6)', () => {
  it('photo before capture: the 4:3 tile with the camera prompt (ق2)', () => {
    const { container } = render(<EvidenceSlot variant="photo" />);
    expect(screen.getByText(ar['evidence.takePhoto'].text)).not.toBeNull();
    const tile = container.querySelector('.mds-evidence-slot-tile');
    expect(tile).not.toBeNull();
    // aspect-ratio is a CSS contract (browser gates verify the 4:3).
  });

  it('photo after capture: the image + redo control', () => {
    const { container } = render(<EvidenceSlot variant="photo" value="https://x/y.jpg" />);
    expect(container.querySelector('.mds-evidence-slot-photo')?.getAttribute('src')).toBe('https://x/y.jpg');
    expect(container.querySelector('.mds-evidence-slot-redo')).not.toBeNull();
  });

  it('exactly ONE kind shows (ق1): code renders a TextField, no tile', () => {
    const { container } = render(<EvidenceSlot variant="code" value="" onChange={() => {}} />);
    expect(container.querySelector('.mds-evidence-slot-tile')).toBeNull();
    expect(container.querySelector('input')).not.toBeNull();
    expect(screen.getByText(ar['evidence.codeLabel'].text)).not.toBeNull();
  });

  it('code error text renders under the field (§4.6 item 4)', () => {
    render(<EvidenceSlot variant="code" value="12" error={ar['evidence.codeError'].text} onChange={() => {}} />);
    expect(screen.getByText(ar['evidence.codeError'].text)).not.toBeNull();
  });

  it('owner kind: the sentence + the confirm slot; readOnly hides it', () => {
    const withBtn = render(
      <EvidenceSlot variant="owner" action={<button type="button">{ar['evidence.confirm'].text}</button>} />,
    );
    expect(withBtn.getByText(ar['evidence.ownerSentence'].text)).not.toBeNull();
    expect(withBtn.getByText(ar['evidence.confirm'].text)).not.toBeNull();
    withBtn.unmount();
    const ro = render(<EvidenceSlot variant="owner" readOnly action={<button type="button">x</button>} />);
    expect(ro.queryByText('x')).toBeNull();
  });

  it('readOnly code shows «أُدخل الرمز ✓» (§4.6 item 2)', () => {
    render(<EvidenceSlot variant="code" value="1234" readOnly />);
    expect(screen.getByText(ar['evidence.entered'].text)).not.toBeNull();
  });

  it('the aria reads title, kind and state (§4.6 item 7)', () => {
    render(<EvidenceSlot variant="photo" />);
    const label = screen.getByRole('group').getAttribute('aria-label') ?? '';
    expect(label).toContain(ar['evidence.title'].text);
    expect(label).toContain(ar['evidence.photoMissing'].text);
  });
});
