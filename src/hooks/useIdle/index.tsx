import { useEffect, useState } from "react";

import { debounce as createDebounce } from "./../../utils-event";

const DEFAULT_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "wheel",
];
const TIMEOUT = 60000;
const DEBOUNCE_TIMEOUT = 1000;

export const useIdle = ({
  timeout = TIMEOUT,
  initialState = false,
  debounceTimeout = DEBOUNCE_TIMEOUT,
  events = DEFAULT_EVENTS,
} = {}): boolean => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null;
    let localState: boolean = state;
    const set = (newState: boolean) => {
      if (mounted) {
        localState = newState;
        setState(newState);
      }
    };

    const onEventCallback = () => {
      if (localState) {
        set(false);
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => set(true), timeout);
    };

    const onEvent = createDebounce(onEventCallback, debounceTimeout);

    const onVisibility = () => {
      if (!document.hidden) {
        onEvent();
      }
    };

    for (let i = 0; i < events.length; i++) {
      window.addEventListener(events[i], onEvent, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility, {
      passive: true,
    });

    timeoutId = setTimeout(() => set(true), timeout);

    return () => {
      mounted = false;

      for (let i = 0; i < events.length; i++) {
        window.removeEventListener(events[i], onEvent);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTimeout, events, timeout]);

  return state;
};
