import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorScheme } from '../../src/useColorScheme';

describe('useColorScheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('given default options, when the hook renders, then it returns scheme info and a setMode function', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty('selected');
    expect(result.current[0]).toHaveProperty('system');
    expect(typeof result.current[1]).toBe('function');
  });

  it('given defaultMode, when the hook initializes, then selected matches the option', () => {
    const { result } = renderHook(() => useColorScheme({ defaultMode: 'dark' }));

    expect(result.current[0].selected).toBe('dark');
  });

  it('given a rendered hook, when setMode is called, then selected updates', () => {
    const { result } = renderHook(() => useColorScheme({ defaultMode: 'light' }));

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0].selected).toBe('dark');
  });

  it('given a rendered hook, when it rerenders, then setMode keeps a stable reference', () => {
    const { result, rerender } = renderHook(() => useColorScheme({ defaultMode: 'auto' }));

    const firstSetMode = result.current[1];
    rerender();

    expect(result.current[1]).toBe(firstSetMode);
  });

  it('given two hook instances, when one setMode is called, then each instance keeps its own scheme', () => {
    const { result: result1 } = renderHook(() => useColorScheme({ defaultMode: 'light' }));
    const { result: result2 } = renderHook(() => useColorScheme({ defaultMode: 'light' }));

    act(() => {
      result1.current[1]('dark');
    });

    expect(result1.current[0].selected).toBe('dark');
    expect(result2.current[0].selected).toBe('light');
  });
});
