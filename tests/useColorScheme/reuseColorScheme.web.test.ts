import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMatchScheme, type MatchScheme } from '@pastweb/tools';
import { reuseColorScheme } from '../../src/useColorScheme';

describe('reuseColorScheme', () => {
  let matchScheme: MatchScheme;

  beforeEach(() => {
    vi.clearAllMocks();
    matchScheme = createMatchScheme();
  });

  it('given a MatchScheme, when reuseColorScheme is called, then it returns a hook function', () => {
    expect(typeof reuseColorScheme(matchScheme)).toBe('function');
  });

  it('given a MatchScheme, when the returned hook renders, then it returns scheme info and a setMode function', () => {
    const useReusedColorScheme = reuseColorScheme(matchScheme);
    const { result } = renderHook(() => useReusedColorScheme());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toEqual(matchScheme.getInfo());
    expect(typeof result.current[1]).toBe('function');
  });

  it('given a shared MatchScheme, when setMode is called, then the hook state updates', () => {
    const useReusedColorScheme = reuseColorScheme(matchScheme);
    const { result } = renderHook(() => useReusedColorScheme());

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0].selected).toBe('dark');
    expect(matchScheme.getInfo().selected).toBe('dark');
  });

  it('given a shared MatchScheme, when setMode is called on the scheme, then the hook state updates', () => {
    const useReusedColorScheme = reuseColorScheme(matchScheme);
    const { result } = renderHook(() => useReusedColorScheme());

    act(() => {
      matchScheme.setMode('dark');
    });

    expect(result.current[0].selected).toBe('dark');
  });

  it('given two hook instances from the same factory, when one setMode is called, then both reflect the change', () => {
    const useReusedColorScheme = reuseColorScheme(matchScheme);
    const { result: result1 } = renderHook(() => useReusedColorScheme());
    const { result: result2 } = renderHook(() => useReusedColorScheme());

    act(() => {
      result1.current[1]('light');
    });

    expect(result1.current[0].selected).toBe('light');
    expect(result2.current[0].selected).toBe('light');
  });

  it('given a mocked MatchScheme, when the hook unmounts, then listeners are removed', () => {
    const removeModeListener = vi.fn();
    const removeSysListener = vi.fn();

    const mockSchemeWithListeners = {
      ...matchScheme,
      onModeChange: vi.fn(() => ({
        removeListener: removeModeListener,
        eventCallbackKey: 'mode-change-key',
      })),
      onSysSchemeChange: vi.fn(() => ({
        removeListener: removeSysListener,
        eventCallbackKey: 'sys-scheme-key',
      })),
      getInfo: matchScheme.getInfo,
      setMode: matchScheme.setMode,
    } as MatchScheme;

    const useReusedColorScheme = reuseColorScheme(mockSchemeWithListeners);
    const { unmount } = renderHook(() => useReusedColorScheme());

    unmount();

    expect(removeModeListener).toHaveBeenCalledTimes(1);
    expect(removeSysListener).toHaveBeenCalledTimes(1);
  });

  it('given a rendered hook, when it rerenders, then setMode keeps a stable reference', () => {
    const useReusedColorScheme = reuseColorScheme(matchScheme);
    const { result, rerender } = renderHook(() => useReusedColorScheme());

    const firstSetMode = result.current[1];
    rerender();

    expect(result.current[1]).toBe(firstSetMode);
  });
});
