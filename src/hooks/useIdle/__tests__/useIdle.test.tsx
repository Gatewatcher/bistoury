import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import { useIdle } from '..';

describe('useIdle', () => {
  const user = userEvent.setup();

  const wrapper = () => {
    return <div data-testid="outside-div">clickable div</div>;
  };

  const renderUseIdle = (...args: Partial<Parameters<typeof useIdle>>) => {
    const { rerender, ...rest } = renderHook(args => useIdle(...args), {
      initialProps: args,
    });

    return {
      rerender: (...args: Parameters<typeof useIdle>) => rerender(args),
      ...rest,
    };
  };

  it('should not be idle by default', async () => {
    const isIdle = renderUseIdle().result.current;
    expect(isIdle).toBe(false);
  });

  it('should be idle initialState true', async () => {
    const isIdle = renderUseIdle({ initialState: true }).result.current;
    expect(isIdle).toBe(true);
  });

  it('should not be idle after click on document body div', async () => {
    const isIdleHook = renderHook(
      () =>
        useIdle({
          initialState: true,
          timeout: 0,
          debounceTimeout: 0,
        }),
      {
        wrapper,
      },
    );
    expect(isIdleHook.result.current).toBe(true);
    await user.click(document.querySelector('[data-testid="outside-div"]')!);
    expect(isIdleHook.result.current).toBe(false);
  });

  it('should be idle after some times without user interaction', async () => {
    vi.useFakeTimers();
    const isIdleHook = renderUseIdle({
      initialState: false,
      timeout: 1000,
      debounceTimeout: 0,
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(isIdleHook.result.current).toBe(true);
  });
});
