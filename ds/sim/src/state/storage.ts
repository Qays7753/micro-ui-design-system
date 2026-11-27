/**
 * On-device persistence (owner decision 2): what the experimenter records is
 * saved on the device in localStorage under a key that CARRIES THE DATA
 * VERSION. A snapshot from a different (older) version walks the migration
 * chain; part A ships version 1 with an empty chain, so any foreign snapshot
 * starts fresh (the trial data is the original; nothing of the product is
 * lost). «ابدأ من جديد» clears the storage completely.
 */
import { initialState } from './initial';
import type { SimState } from './types';

/** The trial data version — bump when the §5.2 data shape changes. */
export const DATA_VERSION = 1;

const PREFIX = 'micro-sim';

const keyFor = (version: number): string => `${PREFIX}:v${version}`;

/** One migration step: lift a snapshot of `from` version to `from + 1`. */
type Migration = (snapshot: unknown) => unknown;

/**
 * The migration chain. Empty in part A (version 1 is the first shape);
 * part B appends steps when the data version moves.
 */
const MIGRATIONS: Record<number, Migration> = {};

interface Snapshot {
  version: number;
  state?: unknown;
}

/** The stored envelope: { version, state } with state sans the version. */
export function saveState(state: SimState): void {
  const { version: _version, ...rest } = state;
  const snap: Snapshot = { version: DATA_VERSION, state: rest };
  window.localStorage.setItem(keyFor(DATA_VERSION), JSON.stringify(snap));
}

/** Every stored micro-sim key with its version (old versions included). */
export function storedVersions(): number[] {
  const found: number[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k) continue;
    const m = k.match(new RegExp(`^${PREFIX}:v(\\d+)$`));
    if (m) found.push(Number.parseInt(m[1], 10));
  }
  return found.sort((a, b) => a - b);
}

/** Hydrate a parsed snapshot into a full state (filling any missing shell field). */
function hydrate(state: unknown): SimState {
  const base = initialState();
  const s = state as Partial<SimState>;
  return {
    ...base,
    ...s,
    toggles: { ...base.toggles, ...(s.toggles ?? {}) },
    identity: { ...base.identity, ...(s.identity ?? {}) },
  };
}

/**
 * Load the persisted state. The migration chain walks any older snapshot up
 * to the current version; a snapshot from an unknown future version (or a
 * broken one) is ignored → the caller starts from the trial data.
 */
export function loadState(): SimState | null {
  const versions = storedVersions();
  if (versions.length === 0) return null;
  const usable = versions.filter((v) => v <= DATA_VERSION);
  if (usable.length === 0) return null;
  const from = usable[usable.length - 1];
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(keyFor(from));
  } catch {
    return null;
  }
  if (!raw) return null;
  let snap: Snapshot;
  try {
    snap = JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
  if (typeof snap.version !== 'number' || snap.version !== from) return null;
  let value: unknown = snap.state;
  for (let v = from; v < DATA_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) return null; // no chain for this jump → fresh
    try {
      value = step(value);
    } catch {
      return null;
    }
  }
  return hydrate(value);
}

/** «ابدأ من جديد»: every stored micro-sim key goes, the state is the original. */
export function resetStorage(): SimState {
  for (const v of storedVersions()) {
    window.localStorage.removeItem(keyFor(v));
  }
  return initialState();
}
