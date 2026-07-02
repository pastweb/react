import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { computed } from '../../src/computed';

describe('computed', () => {
  it('returns the computed value', () => {
    const { result } = renderHook(() =>
      computed(() => 1 + 1, [])
    );

    expect(result.current).toBe(2);
  });

  it('memoizes the computed value when dependencies do not change', () => {
    const fn = vi.fn(() => ({ value: 10 }));

    const { result, rerender } = renderHook(
      ({ count }) => computed(() => fn(), [count]),
      {
        initialProps: { count: 1 },
      }
    );

    const firstValue = result.current;

    rerender({ count: 1 });

    const secondValue = result.current;

    expect(firstValue).toBe(secondValue);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('recomputes the value when dependencies change', () => {
    const fn = vi.fn((count: number) => ({
      value: count,
    }));

    const { result, rerender } = renderHook(
      ({ count }) => computed(() => fn(count), [count]),
      {
        initialProps: { count: 1 },
      }
    );

    expect(result.current.value).toBe(1);

    rerender({ count: 2 });

    expect(result.current.value).toBe(2);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('supports complex computed values', () => {
    const users = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ];

    const { result } = renderHook(() =>
      computed(
        () => users.filter((user) => user.active),
        [users]
      )
    );

    expect(result.current).toEqual([
      { id: 1, active: true },
      { id: 3, active: true },
    ]);
  });

  it('preserves referential equality when dependencies remain unchanged', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        computed(
          () => ({
            doubled: value * 2,
          }),
          [value]
        ),
      {
        initialProps: { value: 2 },
      }
    );

    const first = result.current;

    rerender({ value: 2 });

    const second = result.current;

    expect(first).toBe(second);
  });
});
