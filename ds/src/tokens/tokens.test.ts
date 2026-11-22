import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getToken, tokens } from './tokens';

/**
 * tokens.ts must be a literal mirror of docs/design-system/tokens.json —
 * the only source of design values (BRIEF appendix A / plan S0 step 3).
 */
describe('tokens', () => {
  it('deep-equals docs/design-system/tokens.json', () => {
    const json = JSON.parse(
      readFileSync(
        join(import.meta.dirname, '..', '..', '..', 'docs', 'design-system', 'tokens.json'),
        'utf8',
      ),
    ) as unknown;
    expect(tokens).toEqual(json);
  });

  it('reads leaves by dotted path', () => {
    expect(getToken('color.canvas')).toBe('#E8ECEF');
    expect(getToken('motion.press-cancel-px')).toBe(8);
    expect(getToken('type.title-screen.size')).toBe(28);
    expect(getToken('font.display')).toBe("'Rubik', 'IBM Plex Sans Arabic', sans-serif");
  });

  it('reads whole arrays as leaves', () => {
    expect(getToken('space')).toEqual([4, 8, 12, 16, 20, 24, 32, 40, 56]);
    expect(getToken('size.icon')).toEqual([14, 16, 20, 24]);
    expect(getToken('size.entity')).toEqual([32, 44, 64]);
  });
});
