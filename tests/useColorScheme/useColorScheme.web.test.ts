import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorScheme } from '../../src/useColorScheme';
import { createMatchScheme, type MatchScheme } from '@pastweb/tools';
import { MatchMedia } from '../util';

// Mock the MatchScheme
let matchMedia: MatchMedia;
let mockMatchScheme: MatchScheme;

const appearanceMq = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)',
};

describe('useColorScheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // matchMedia = new MatchMedia();
    mockMatchScheme = createMatchScheme();
  });

  afterEach(() => {
    // matchMedia.clear();
  });

  it('returns current scheme and setMode function', () => {
    const { result } = renderHook(() => useColorScheme({}, mockMatchScheme));

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty('selected');
    expect(result.current[0]).toHaveProperty('system');
    expect(typeof result.current[1]).toBe('function'); // setMode
  });

  it('initializes with current scheme info', () => {
    const { result } = renderHook(() => useColorScheme({}, mockMatchScheme));

    const [scheme] = result.current;
    expect(scheme).toEqual(mockMatchScheme.getInfo());
  });

  it('updates state when mode changes', () => {
    const { result } = renderHook(() => useColorScheme({}, mockMatchScheme));

    const [, setMode] = result.current;

    act(() => {
      setMode('dark');
    });

    expect(result.current[0].selected).toBe('dark');
  });

  // TODO: We need to find a way to test the update of system scheme in JSDOM environment, since it does not support matchMedia, we can only test the logic of the hook, but not the actual change of system scheme.
  // it('updates state when system scheme changes', () => {
  //   matchMedia.useMediaQuery(appearanceMq.light);

  //   const { result } = renderHook(() => useColorScheme({}, mockMatchScheme));

  //   expect(result.current[0].system).toBe('light');

  //   act(() => {
  //     matchMedia.useMediaQuery(appearanceMq.dark);
  //   });

  //   expect(result.current[0].system).toBe('dark');
  // });

  it('cleans up listeners on unmount', () => {
    const removeModeListener = vi.fn();
    const removeSysListener = vi.fn();

    const mockSchemeWithListeners = {
      ...mockMatchScheme,
      onModeChange: vi.fn(() => ({
        removeListener: removeModeListener,
        eventCallbackKey: 'mode-change-key',   // ← Required by RemoveListener
      })),
      onSysSchemeChange: vi.fn(() => ({
        removeListener: removeSysListener,
        eventCallbackKey: 'sys-scheme-key',    // ← Required by RemoveListener
      })),
      getInfo: mockMatchScheme.getInfo,
      setMode: mockMatchScheme.setMode,
    } as any;

    const { unmount } = renderHook(() => useColorScheme({}, mockSchemeWithListeners));

    unmount();

    expect(removeModeListener).toHaveBeenCalledTimes(1);
    expect(removeSysListener).toHaveBeenCalledTimes(1);
  });

  it('returns new setMode function reference when scheme changes', () => {
    const { result, rerender } = renderHook(() => useColorScheme({}, mockMatchScheme));

    const firstSetMode = result.current[1];

    rerender();

    const secondSetMode = result.current[1];

    // Should return the same function (stable reference from scheme.value.setMode)
    expect(firstSetMode).toBe(secondSetMode);
  });

  it('handles multiple instances correctly', () => {
    const { result: result1 } = renderHook(() => useColorScheme({}, mockMatchScheme));
    const { result: result2 } = renderHook(() => useColorScheme({}, mockMatchScheme));

    act(() => {
      result1.current[1]('light');
    });

    expect(result1.current[0].selected).toBe('light');
    expect(result2.current[0].selected).toBe('light'); // Both should reflect change
  });
});
