/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref, RefCallback } from 'react';

export function mergeRefs<T = any>(refs: Array<Ref<T>>): RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as { current: T | null }).current = value;
      }
    });
  };
}
