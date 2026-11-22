import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LayersProvider, useOpenSheetCount, useSheetLayer } from './layers';

function SheetProbe({ label }: { label: string }) {
  const layer = useSheetLayer();
  return (
    <div
      data-testid={label}
      data-level={layer.level}
      data-over-limit={layer.overLimit ? 'yes' : 'no'}
      data-sheet-z={layer.sheetZ}
      data-scrim-z={layer.scrimZ ?? 'none'}
      data-top={layer.isTop ? 'yes' : 'no'}
    >
      {label}
    </div>
  );
}

function CountProbe() {
  return <p data-testid="count">{useOpenSheetCount()}</p>;
}

describe('layer registry (BRIEF 23.15)', () => {
  it('assigns sheet/scrim z-index variables by level', () => {
    render(
      <LayersProvider>
        <SheetProbe label="first" />
      </LayersProvider>,
    );
    const first = screen.getByTestId('first');
    expect(first.dataset.level).toBe('1');
    expect(first.dataset.sheetZ).toBe('var(--mds-layer-sheet)');
    expect(first.dataset.scrimZ).toBe('var(--mds-layer-scrim)');
    expect(first.dataset.top).toBe('yes');
  });

  it('stacks a second sheet at layer-2 with its own scrim', () => {
    render(
      <LayersProvider>
        <SheetProbe label="first" />
        <SheetProbe label="second" />
      </LayersProvider>,
    );
    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');
    expect(first.dataset.top).toBe('no');
    expect(second.dataset.level).toBe('2');
    expect(second.dataset.sheetZ).toBe('var(--mds-layer-sheet-2)');
    expect(second.dataset.scrimZ).toBe('var(--mds-layer-scrim-2)');
    expect(second.dataset.top).toBe('yes');
  });

  it('marks a third sheet overLimit — the cap is two sheets (BRIEF 23.15)', () => {
    render(
      <LayersProvider>
        <SheetProbe label="first" />
        <SheetProbe label="second" />
        <SheetProbe label="third" />
        <CountProbe />
      </LayersProvider>,
    );
    const third = screen.getByTestId('third');
    expect(third.dataset.overLimit).toBe('yes');
    expect(third.dataset.level).toBe('2'); // capped: replace content, do not stack
    expect(screen.getByTestId('count').textContent).toBe('3');
  });

  it('frees the top slot when a sheet unmounts', () => {
    const { rerender } = render(
      <LayersProvider>
        <SheetProbe label="first" />
        <SheetProbe label="second" />
        <SheetProbe label="third" />
      </LayersProvider>,
    );
    rerender(
      <LayersProvider>
        <SheetProbe label="first" />
        <SheetProbe label="second" />
      </LayersProvider>,
    );
    const second = screen.getByTestId('second');
    expect(second.dataset.overLimit).toBe('no');
    expect(second.dataset.top).toBe('yes');
  });
});
