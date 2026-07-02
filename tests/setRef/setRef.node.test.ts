import { describe, expect, it, vi } from 'vitest';
import { setRef } from '../../src/setRef';

describe('setRef', () => {
  it('assigns the value to an object ref', () => {
    const ref = { current: null as { id: string } | null };
    const node = { id: 'panel' };

    setRef(ref, node);

    expect(ref.current).toBe(node);
  });

  it('calls a callback ref with the value', () => {
    const ref = vi.fn();
    const node = { role: 'button' };

    setRef(ref, node);

    expect(ref).toHaveBeenCalledWith(node);
  });

  it('ignores null and undefined refs', () => {
    const node = { id: 'input' };

    expect(() => setRef(null, node)).not.toThrow();
    expect(() => setRef(undefined, node)).not.toThrow();
  });

  it('supports clearing refs with null values', () => {
    const node = { id: 'panel' };
    const ref = { current: node as { id: string } | null };

    setRef(ref, null);

    expect(ref.current).toBeNull();
  });
});
