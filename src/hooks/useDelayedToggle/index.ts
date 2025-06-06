import { useCallback, useState } from "react";

import { useTimeout } from "./../useTimeout";
import { isNumber } from "./../../utils-lang";

type DelayOption =
  | number
  | {
      toTrue?: number;
      toFalse?: number;
    };

export const useDelayedToggle = (
  initial: boolean,
  delay: DelayOption = 0
): [boolean, (value: boolean, force?: boolean) => void] => {
  const [state, setState] = useState(initial);
  const [setTimeout, clearTimeout] = useTimeout();

  const setter = useCallback(
    (value: boolean, force?: boolean) => {
      if (force) {
        setState(value);
      }
      clearTimeout();
      if (isNumber(delay)) {
        setTimeout(() => setState(value), delay);
      } else {
        setTimeout(() => setState(value), value ? delay.toTrue : delay.toFalse);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay]
  );

  return [state, setter];
};
