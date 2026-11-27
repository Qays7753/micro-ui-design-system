/**
 * SA3 — on-device persistence (owner decision 2): the key carries the data
 * version, saves round-trip, a foreign/older snapshot starts fresh (no
 * migration steps exist in part A), and «ابدأ من جديد» clears the storage.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initialState } from './initial';
import { reducer } from './reducer';
import { DATA_VERSION, loadState, resetStorage, saveState, storedVersions } from './storage';
import type { SimAction } from './types';

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  window.localStorage.clear();
});

describe('SA3 · storage: the key carries the data version', () => {
  it(`the current key is micro-sim:v${DATA_VERSION}`, () => {
    const state = initialState();
    saveState(state);
    expect(window.localStorage.getItem(`micro-sim:v${DATA_VERSION}`)).toBeTruthy();
    expect(storedVersions()).toEqual([DATA_VERSION]);
  });
});

describe('SA3 · storage: what the experimenter records is saved on the device', () => {
  it('a full round-trip returns the recorded state', () => {
    const actions: SimAction[] = [
      { type: 'role/enter', role: 'owner' },
      { type: 'movement/save', input: { type: 'in', fund: 'cash', amount: 25_000, party: 'رنا العبادي', note: 'بيع' } },
      { type: 'amountsHidden/set', hidden: true },
      { type: 'toggles/set', patch: { offline: true } },
      { type: 'tabOrder/set', order: 'a' },
    ];
    const recorded = actions.reduce((s, a) => reducer(s, a), initialState());
    saveState(recorded);
    const loaded = loadState();
    expect(loaded).not.toBeNull();
    expect(loaded).toEqual(recorded);
    expect(loaded!.role).toBe('owner');
    expect(loaded!.movements).toHaveLength(23);
    expect(loaded!.amountsHidden).toBe(true);
    expect(loaded!.toggles.offline).toBe(true);
    expect(loaded!.tabOrder).toBe('a');
  });

  it('the version rides the snapshot, not the state body', () => {
    saveState(initialState());
    const raw = JSON.parse(window.localStorage.getItem(`micro-sim:v${DATA_VERSION}`)!);
    expect(raw.version).toBe(DATA_VERSION);
    expect(raw.state.version).toBeUndefined();
  });
});

describe('SA3 · storage: migration when the data version changes', () => {
  it('a snapshot from an unknown older version starts fresh (part A has no steps)', () => {
    const older = { version: 0, state: { role: 'owner' } };
    window.localStorage.setItem('micro-sim:v0', JSON.stringify(older));
    const loaded = loadState();
    // Fresh trial data — never a crash, never half-hydrated fields.
    expect(loaded).toBeNull();
  });
  it('a snapshot from a future version is ignored, never misread', () => {
    window.localStorage.setItem(`micro-sim:v${DATA_VERSION + 5}`, JSON.stringify({ version: DATA_VERSION + 5, state: { role: 'owner' } }));
    const loaded = loadState();
    expect(loaded).toBeNull();
  });
  it('a broken payload is ignored', () => {
    window.localStorage.setItem(`micro-sim:v${DATA_VERSION}`, '{not json');
    expect(loadState()).toBeNull();
  });
  it('the current version wins over older leftovers', () => {
    saveState(initialState());
    window.localStorage.setItem('micro-sim:v0', JSON.stringify({ version: 0, state: {} }));
    expect(storedVersions()).toEqual([0, DATA_VERSION]);
    expect(loadState()).not.toBeNull();
  });
});

describe('SA3 · «ابدأ من جديد» clears the device storage', () => {
  it('resetStorage wipes every micro-sim key and returns the original', () => {
    const recorded = reducer(initialState(), { type: 'role/enter', role: 'driver' });
    saveState(recorded);
    window.localStorage.setItem('micro-sim:v0', JSON.stringify({ version: 0, state: {} }));
    const fresh = resetStorage();
    expect(fresh).toEqual(initialState());
    expect(storedVersions()).toEqual([]);
    expect(loadState()).toBeNull();
  });
});
